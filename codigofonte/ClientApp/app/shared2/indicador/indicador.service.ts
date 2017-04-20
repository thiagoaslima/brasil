import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Indicador, EscopoIndicadores, Metadado, UnidadeIndicador, Ranking } from './indicador.model';
import { flatTree } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class IndicadorService2 {

    constructor(
        private _http: Http
    ) {
        Indicador.setIndicadoresStrategy({
            retrieve: this.getIndicadoresByPosicao.bind(this)
        })
    }

    getIndicadoresByPosicao(pesquisaId: number, posicao: string, escopo: string): Observable<Indicador[]> {
        let url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${posicao}?scope=${escopo}`;

        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => ({}) }))
            .map(res => res.json())
            .map(json => flatTree(json))
            .map(array => array.map(obj => Indicador.criar(Indicador.converter(Object.assign(obj, { pesquisaId })))))
            .map(array => this._rebuildTree(array))
            // .do(indicador => console.log(`getIndicadoresByPosicao`, indicador))
            .share();
    }

    getIndicadoresById(pesquisaId: number, indicadorId: number | number[], escopo: string, localidade?, fontesNotas = false): Observable<Indicador[]> {
        const ids = Array.isArray(indicadorId) ? indicadorId.join('|') : indicadorId.toString();
        const queryLocalidade = localidade === undefined ? '' : `&localidade=${Array.isArray(localidade) ? localidade.join(',') : localidade}`;
        let url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${ids}?scope=${escopo}${queryLocalidade}`;

        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => ({}) }))
            .map(res => res.json())
            //.map(json => flatTree(json))
            .map(array => array.map(obj => Indicador.criar(Indicador.converter(Object.assign(obj, { pesquisaId })))))
            //.map(array => this._rebuildTree(array))
            .do(indicadores => {
                //adiciona fonte e notas, da pesquisa nos indicadores
                if (fontesNotas && indicadores.length > 0) {
                    indicadores[0].pesquisa.subscribe((pesquisa) => {
                        //organiza os períodos da pesquisa em ordem crescente
                        pesquisa.periodos.sort((a, b) => a.nome > b.nome ? 1 : -1);
                        //pega fontes e notas do período mais recente
                        let fontes = pesquisa.periodos.length ? pesquisa.periodos[pesquisa.periodos.length - 1].fontes : null;
                        let notas = pesquisa.periodos.length ? pesquisa.periodos[pesquisa.periodos.length - 1].notas : null;
                        for (let i = 0; i < indicadores.length; i++) {
                            indicadores[i].fontes = fontes;
                            indicadores[i].notas = notas;
                        }
                    });
                }
                // console.log(`getIndicadorById`, indicadores);
            })
            .share();
    }

    private _getVariosIndicadoresByIdCache = {};
    private getVariosIndicadoresByIdKeyCache(indicadorMapPesquisa, indicadorId: number | number[], localidade?, fontesNotas = false): string {
        let indicadorIdString = Array.isArray(indicadorId) ? indicadorId.join('|') : indicadorId.toString();
        let localidadeString = localidade === undefined ? '' : Array.isArray(localidade) ? localidade.join(',') : localidade;
        let fontesNotasString = fontesNotas.toString();

        return [indicadorIdString, localidadeString, fontesNotasString].join(';');
    }
    getVariosIndicadoresById(indicadorMapPesquisa, indicadorId: number | number[], localidade?, fontesNotas = false): Observable<Indicador[]> {
        let keyCache = this.getVariosIndicadoresByIdKeyCache(indicadorMapPesquisa, indicadorId, localidade, fontesNotas);

        if (!this._getVariosIndicadoresByIdCache[keyCache]) {
            const queryIndicadores = Array.isArray(indicadorId) ? indicadorId.join('|') : indicadorId.toString();
            const queryLocalidades = localidade === undefined ? '' : `&localidades=${Array.isArray(localidade) ? localidade.join(',') : localidade}`;

            let urlValores = `http://servicodados.ibge.gov.br/api/v1/pesquisas/valores?indicadores=${queryIndicadores}${queryLocalidades}`;
            let urlIndicadores = `http://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores?indicadores=${queryIndicadores}`;

            let fallBackError = err => Observable.of({ json: () => ({}) });

            this._getVariosIndicadoresByIdCache[keyCache] = Observable.zip(
                this._http.get(urlValores, options).retry(3),
                this._http.get(urlIndicadores, options).retry(3)
            )
                .catch(err => Observable.of([{ json: () => ({}) }, { json: () => ({}) }]))
                .map(([valores, indicadores]) => [valores.json(), indicadores.json()])
                .map(([valores, indicadores]: any[][]) => {
                    return indicadores.map((indicador) => {
                        let valor = valores.find((valor) => valor.id === indicador.id);
                        if (valor) {
                            indicador.res = valor.res;
                        } else {
                            indicador.res = [{
                                localidade: localidade,
                                res: {}
                            }]
                        }
                        
                        return indicador;
                    })
                })
                .map(array => array.map(obj => Indicador.criar(Indicador.converter(Object.assign(obj, { pesquisaId: indicadorMapPesquisa[obj.id.toString()] })))))
                .do(indicadores => {
                    //adiciona fonte e notas, da pesquisa nos indicadores
                    if (fontesNotas && indicadores.length > 0) {
                        for (let i = 0; i < indicadores.length; i++) {
                            indicadores[i].pesquisa.subscribe((pesquisa) => {
                                //organiza os períodos da pesquisa em ordem crescente
                                pesquisa.periodos.sort((a, b) => a.nome > b.nome ? 1 : -1);
                                //pega fontes e notas do período mais recente
                                let fontes = pesquisa.periodos.length ? pesquisa.periodos[pesquisa.periodos.length - 1].fontes : null;
                                let notas = pesquisa.periodos.length ? pesquisa.periodos[pesquisa.periodos.length - 1].notas : null;
                                indicadores[i].fontes = fontes;
                                indicadores[i].notas = notas;
                            });
                        }
                    }
                })
                .share();
        }

        return this._getVariosIndicadoresByIdCache[keyCache];
    }

    getPosicaoRelativa(pesquisaId: number, indicadorId: number, periodo: string, codigoLocalidade: number, contexto = 'BR'): Observable<Ranking> {
        let url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${indicadorId}/ranking?orderBy=&contexto=${contexto}&localidade=${codigoLocalidade}&lower=0`;

        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => [{ res: [] }] }))
            .map(res => res.json())
            .map(arr => {
                const ranking = arr[0];
                let valores = {}, universo = 1;

                if (ranking.res.length > 0) {
                    valores = ranking.res[0];
                    universo = ranking.res[ranking.res.length - 1]['#'];
                }

                return {
                    localidade: parseInt(valores['localidade'] || codigoLocalidade, 10),
                    indicador: parseInt(ranking.indicador, 10),
                    periodo: periodo,
                    contexto: contexto,
                    posicaoAbsoluta: valores['#'],
                    ranking: valores['ranking'],
                    res: valores['res'],
                    qtdeItensComparados: universo
                } as Ranking
            })
    }

    public getRankings(indicadoresId: number[], periodos: string[], codigoLocalidade: number, contexto: string[]): Observable<Ranking[]> {
        const query = indicadoresId.map((id, index) => `${id}(${periodos[index]})`).join('|');
        const _contexto = contexto.join(',')
        const url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/ranking/${query}?lower=0&contexto=${_contexto}&localidade=${codigoLocalidade}`;

        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => [{ res: [] }] }))
            .map(res => res.json())
            .map(rankings => {

                return rankings.map(ranking => {
                    let valores = {}, universo = 1;

                    if (ranking.res.length > 0) {
                        valores = ranking.res[0];
                        universo = ranking.res[ranking.res.length - 1]['#'];
                    }

                    return {
                        localidade: parseInt(valores['localidade'] || codigoLocalidade, 10),
                        indicador: parseInt(ranking.indicador, 10),
                        periodo: ranking.periodo,
                        contexto: ranking.contexto,
                        posicaoAbsoluta: valores['#'],
                        ranking: valores['ranking'],
                        res: valores['res'],
                        qtdeItensComparados: universo
                    } as Ranking
                })

            })


    }

    private _rebuildTree(indicadores: Indicador[]): Indicador[] {
        let arr = [] as Indicador[];

        const hash: Indicador[] = indicadores.reduce((hash, item) => Object.assign(hash, { [item.posicao]: item }), Object.create(null))
        const keys = Object.keys(hash).sort();
        const minLen = Math.min(...keys.map(key => key.toString().split('.').length));
        const children = Object.keys(hash).sort().reduce((agg, key) => {
            const _key = key.toString().split('.');

            if (_key.length === minLen) {
                arr.push(hash[key]);
                return agg;
            }

            const parentKey = _key.slice(0, -1).join('.');
            if (!agg[parentKey]) { agg[parentKey] = []; }
            agg[parentKey].push(hash[key]);
            return agg;

        }, Object.create(null));

        return arr;
    }
}