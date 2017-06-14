import { RankingService3 } from '../shared3/services/ranking.service';
import { dadosGrafico, dadosPainel } from './configuration/panorama.values';
import { Injectable } from '@angular/core';

import { PANORAMA, ItemConfiguracao, PanoramaVisualizacao } from './configuration';
import { ResultadoService3 } from '../shared3/services';
import { Localidade, Resultado } from '../shared3/models';
import { converterObjArrayEmHash, getProperty } from '../utils2';
import { notasEspeciais } from '../../api/notas-demanda-legal';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class Panorama2Service {

    constructor(
        private _resultadoService: ResultadoService3,
        private _rankingService3: RankingService3
    ) { }

    getResumo(configuracao: Array<ItemConfiguracao>, localidade: Localidade) {
        return this._getResultadosIndicadores(configuracao, localidade)
            .map(resultados => {
                return configuracao.map(item => {
                    const periodo = item.periodo || resultados[item.indicadorId].periodoValidoMaisRecente;

                    return {
                        tema: item.tema,
                        titulo: item.titulo || (resultados[item.indicadorId] && resultados[item.indicadorId].indicador.nome),
                        periodo: periodo,
                        valor: resultados[item.indicadorId] && resultados[item.indicadorId].getValor(periodo),
                        unidade: resultados[item.indicadorId] && resultados[item.indicadorId].indicador.unidade.toString()
                    }
                })
            })
    }

    getTemas(configuracao: Array<ItemConfiguracao>, localidade: Localidade) {
        const resultados$ = this._getResultadosIndicadores(configuracao, localidade);
        const rankings$ = this._getPosicaoRankings(configuracao, localidade);

        return Observable.zip(
            resultados$,
            rankings$
        ).map(([resultados, rankings]) => ({
            configuracao: this._organizarConfiguracaoParaTemas(configuracao, resultados, rankings),
            resultados: resultados,
            rankings: rankings
        }))
    }

    getNotaEspecial(idLocalidade: number, idIndicador: number): string{

        let notaEspecial = notasEspeciais.filter(nota => nota.localidade == idLocalidade && nota.indicador == idIndicador);

        return !!notaEspecial ? notaEspecial['nota'] : '';
    }

    private _getResultadosIndicadores(configuracao: Array<ItemConfiguracao>, localidade: Localidade): Observable<{ [indicadorId: number]: Resultado }> {
        const indicadoresId = configuracao.reduce((arr, item) => {
            arr.push(item.indicadorId);

            if (item.grafico) {
                item.grafico.dados.forEach(obj => {
                    arr.push(obj.indicadorId)
                });
            }

            return arr;
        }, []);

        return this._resultadoService
            .getResultadosCompletos(indicadoresId, localidade.codigo)
            .map(resultados => converterObjArrayEmHash(resultados, 'indicador.id'))
    }

    private _getPosicaoRankings(configuracao: Array<ItemConfiguracao>, localidade: Localidade): Observable<{ [indicadorId: number]: { [contexto: string]: any } }> {
        let indicadores = configuracao
            .filter(item => item.visualizacao === PanoramaVisualizacao.painel)
            .map(item => ({ indicadorId: item.indicadorId, periodo: item.periodo }));

        /* 
            TO DO: implementar chamada do serviço de ranking
        */
        let contextos = ['BR'];
        if (localidade.parent.codigo) { contextos.push(localidade.parent.codigo.toString()) }
        if (localidade.microrregiao) { contextos.push(localidade.microrregiao.toString()) }

        return this._rankingService3.getRankingsIndicador(indicadores, contextos, localidade.codigo)
            .map(response => {
                return response.reduce((agg, ranking) => {
                    const id = ranking.indicadorId;

                    if (!agg[id]) {
                        agg[id] = {}
                    }

                    const _ranking = ranking && ranking.res && ranking.res[0] && ranking.res[0].ranking;

                    switch (ranking.contexto) {
                        case 'BR':
                            agg[id].BR = { posicao: _ranking, itens: 5570 }
                            break;

                        case localidade.parent.codigo.toString():
                            agg[id].local = { posicao: _ranking, itens: localidade.parent.children.length }
                            break;

                        case localidade.microrregiao.toString():
                            agg[id].microrregiao = { posicao: _ranking, itens: 50 }
                            break;
                    }

                    return agg;
                }, {})
            })

        
    }

    private _organizarConfiguracaoParaTemas(configuracao: ItemConfiguracao[], resultados: { [indicadorId: number]: Resultado }, rankings): Array<{ tema: string, painel: dadosPainel[], graficos: dadosGrafico[] }> {
        const { temas } = configuracao
            .reduce(({ temas, posicao }, item) => {
                if (!item.tema) {
                    return { temas, posicao };
                }

                if (!temas[item.tema]) {
                    temas[item.tema] = {
                        idx: posicao,
                        painel: [],
                        graficos: []
                    }
                    posicao++;
                }

                if (item.visualizacao === PanoramaVisualizacao.painel) {
                    const painel = this._prepararDadosPainel(item, resultados, rankings);
                    temas[item.tema].painel.push(painel);
                }

                if (item.visualizacao === PanoramaVisualizacao.grafico) {
                    const grafico = this._prepararDadosGrafico(item, resultados);
                    temas[item.tema].graficos.push(grafico);
                }

                return { temas, posicao };
            }, { temas: {}, posicao: 0 });

        return Object.keys(temas)
            .reduce((agg, tema) => {
                let { idx, painel, graficos } = temas[tema];
                agg[idx] = { tema, painel, graficos };
                return agg;
            }, [])
            .reduce((arr, itens) => arr.concat(itens), []);
    }

    private _prepararDadosPainel(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }, rankings): dadosPainel {
        const resultado = resultados[item.indicadorId];

        return {
            indicadorId: item.indicadorId,
            titulo: item.titulo,
            valor: resultado && resultado.valorValidoMaisRecente,
            unidade: resultado && resultado.indicador.unidade.toString(),
            ranking: rankings[item.indicadorId]
        }
    }

    private _prepararDadosGrafico(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }) {
        return {
            tipo: item.grafico.tipo,
            titulo: item.grafico.titulo,
            eixoX: this.getEixoX(item, resultados),
            dados: this.getDados(item, resultados),
            fontes: this.getFontes(item, resultados)
        }
    }

    private getEixoX(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }): string[] {
        const indicadorId = item.grafico.dados[0].indicadorId;
        return resultados[indicadorId].periodosValidos;
    }

    private getDados(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }): { data: number[], label: string }[] {
        return item.grafico.dados.map(item => {
            const indicadorId = item.indicadorId;
            const resultado = resultados[indicadorId];
            const valores = resultado.valoresValidos.map(valor => this.converterParaNumero(valor));
            const nome = resultado.indicador.nome;

            return { data: valores, label: nome }
        })
    }

    private getFontes(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }): string[] {
        if (item.grafico.fontes && item.grafico.fontes.length > 0) {
            return item.grafico.fontes;
        }

        const indicadorId = item.grafico.dados[0].indicadorId;
        return resultados[indicadorId].indicador.pesquisa.getAllFontes();
    }

    private converterParaNumero(valor: string): number {
        if (valor == '99999999999999' || valor == '99999999999998' || valor == '99999999999997' ||
            valor == '99999999999996' || valor == '99999999999995' || valor == '99999999999992' ||
            valor == '99999999999991') {

            valor = '0';
        }
        return !!valor ? Number(valor.replace(',', '.')) : Number(valor)
    }

}