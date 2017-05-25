import { Injectable } from '@angular/core';

import { PANORAMA, ItemConfiguracao, ItemTemaView, PanoramaVisualizacao } from './configuration';
import { ResultadoService3 } from '../shared3/services';
import { Localidade, Resultado } from '../shared3/models';
import { converterObjArrayEmHash, getProperty } from '../utils2';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class Panorama2Service {

    constructor(
        private _resultadoService: ResultadoService3
    ) { }

    getResumo() {

    }

    getTemas(configuracao: Array<ItemConfiguracao>, localidade: Localidade) {
        const resultados$ = this._getResultadosIndicadores(configuracao, localidade);
        const rankings$ = this._getPosicaoRankings(configuracao, localidade);
        const _configuracao = this._organizarConfiguracaoParaTemas(configuracao);

        return Observable.zip(
            resultados$,
            rankings$
        ).map(([resultados, rankings]) => ({
            configuracao: _configuracao,
            resultados: resultados,
            rankings: rankings
        }))
    }

    private _getResultadosIndicadores(configuracao: Array<ItemConfiguracao>, localidade: Localidade): Observable<{ [indicadorId: number]: Resultado }> {
        return this._resultadoService
            .getResultadosCompletos(<number[]>configuracao.map(getProperty('indicadorId')), localidade.codigo)
            .map(resultados => converterObjArrayEmHash(resultados, 'indicador.id'))
    }

    private _getPosicaoRankings(configuracao: Array<ItemConfiguracao>, localidade: Localidade): Observable<{[indicadorId: number]: {[contexto: string]: any}}> {
        let indicadores = configuracao
            .filter(item => item.visualizacao === PanoramaVisualizacao.painel)
            .map(item => item.indicadorId);

        /* 
            TO DO: implementar chamada do serviço de ranking
        */
        let ctxLocal = localidade.codigo.toString();
        let ctxMicro = localidade.microrregiao.toString();

        let ranks = indicadores.reduce((agg, indicadorId) => {
            let ranking = { 'BR': 2, [ctxLocal]: 2, [ctxMicro]: 2 };
            agg[indicadorId] = ranking;
             return agg;
        }, {});

        return Observable.of(ranks);
    }

    private _organizarConfiguracaoParaTemas(configuracao) {
        const { temas } = configuracao
            .filter(item => Boolean(item.tema))
            .reduce(({ temas, posicao }, item) => {
                if (!temas[item.tema]) {
                    temas[item.tema] = {
                        idx: posicao,
                        painel: [],
                        graficos: []
                    }
                    posicao++;
                }

                if (item.visualizacao === PanoramaVisualizacao.painel) {
                    temas[item.tema].painel.push(item);
                }

                if (item.visualizacao === PanoramaVisualizacao.grafico) {
                    temas[item.tema].graficos.push(item);
                }

                return { temas, posicao };
            }, { temas: {}, posicao: 0 });

        return Object.keys(temas)
            .reduce((agg, tema) => {
                let obj = temas[tema];
                agg[obj.idx] = obj.painel.concat(obj.graficos);
                return agg;
            }, [])
            .reduce((arr, itens) => arr.concat(itens), []);
    }

}