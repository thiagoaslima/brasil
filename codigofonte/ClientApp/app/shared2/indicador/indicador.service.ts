import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { discardPeriodicTasks } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

import { log } from 'util';
import { Localidade } from '../localidade/localidade.model';
import { ItemRanking, RankingLocalidade } from '../../pesquisa/pesquisa-ranking/ranking.model';
import { LocalidadeService2 } from '../localidade/localidade.service';
import { Indicador, EscopoIndicadores, Metadado, UnidadeIndicador, Ranking } from './indicador.model';
import { flatTree } from '../../utils/flatFunctions';
import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';
import {TraducaoService} from '../../traducao/traducao.service';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class IndicadorService2 {

    idioma:string;
    constructor(
        private _http: Http,
        private _localidadeService: LocalidadeService2,
        private modalErrorService: ModalErrorService,
        private _traducaoService:TraducaoService
    ) {
        Indicador.setIndicadoresStrategy({
            retrieve: this.getIndicadoresByPosicao.bind(this)
        })
        this.idioma = this._traducaoService.lang;
      
    }

    getIndicadoresByPosicao(pesquisaId: number, posicao: string, escopo: string, periodo: string = 'all'): Observable<Indicador[]> {

        let url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${posicao}?scope=${escopo}&lang=${this.idioma}`;

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

    getIndicadorById(indicadorId: number, localidade: number | string): Observable<Indicador[]> {

        let url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/${indicadorId}?localidade=${localidade}}&lang=${this.idioma}`;

        return this._http.get(url, options)
            .map(res => res.json())
            .map(array => array.map(Indicador.criar));
    }

    getIndicadoresById(pesquisaId: number, indicadorId: number | number[], escopo: string, localidade?, fontesNotas = false, periodo: string = 'all'): Observable<Indicador[]> {

        periodo = !periodo ? 'all' : periodo;

        const ids = Array.isArray(indicadorId) ? indicadorId.join('|') : indicadorId.toString();
        const queryLocalidade = localidade === undefined || null ? '' : `&localidade=${Array.isArray(localidade) ? localidade.join(',') : localidade}`;
        
        let url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${ids}?scope=${escopo}${queryLocalidade}&lang=${this.idioma}`;

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
                    }, 
                    error => {
                        console.error(error);
                        this.modalErrorService.showError();
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

            let urlValores = `https://servicodados.ibge.gov.br/api/v1/pesquisas/valores?indicadores=${queryIndicadores}${queryLocalidades}&lang=${this.idioma}`;
            let urlIndicadores = `https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores?indicadores=${queryIndicadores}&lang=${this.idioma}`;

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
                            },
                            error => {
                                console.error(error);
                                this.modalErrorService.showError();
                            });
                        }
                    }
                })
                .share();
        }

        return this._getVariosIndicadoresByIdCache[keyCache];
    }


    getPosicaoRelativa(pesquisaId: number, indicadorId: number, periodo: string, codigoLocalidade: number, contexto = 'BR'): Observable<Ranking> {

        let url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${indicadorId}/ranking?contexto=${contexto}&localidade=${codigoLocalidade}&lower=0&lang=${this.idioma}`;   

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

    _cacheRanking = Object.create(null) as {[label: string]: Observable<Ranking>|Observable<Ranking[]>};
    public getRankings(indicadoresId: number[], periodos: string[], codigoLocalidade: number, contexto: string[]): Observable<Ranking[]> {
        const permutacao = [];
        contexto = contexto.map(c => c.toString())

        indicadoresId.forEach((id, idx) => {
            contexto.forEach(contexto => {
                permutacao.push({
                    id: id,
                    periodo: periodos[idx],
                    localidade: codigoLocalidade,
                    contexto: contexto.toString()
                })
            })
        });

        let cases = permutacao.reduce( (acc, obj) => {
            let cache = this._cacheRanking[this._convertIntoKey(obj)];

            if (cache) {
                acc.cache.push(cache);
            } else {
                acc.requests.push(obj);
            }

            return acc;
        }, {cache: [], requests: []})

        if (cases.requests.length === 0) {
            return Observable.zip<Ranking>(...cases.cache).map(arr => arr.reduce( (agg, val) => agg.concat(val), [] ) );
        }

        const removeDuplicates = cases.requests.reduce( (acc, obj) => {
            if (!acc[obj.id]) {
                acc[obj.id] = obj.periodo
            }
            return acc;
        }, {})

        const request = this._getRankingsRequest(Object.keys(removeDuplicates).map(n => Number.parseInt(n, 10)), Object.keys(removeDuplicates).map(k => removeDuplicates[k]), codigoLocalidade, contexto)
            .do(responses => cases.requests.forEach((obj, idx) => this._cacheRanking[this._convertIntoKey(obj)] = Observable.of(responses[idx])))
            .map(responses => responses.concat(cases.cache))
            .map(rankings => indicadoresId.reduce( (acc, id) => {
                contexto.forEach(contexto => {
                    let r = rankings.find(rank => rank.indicador === id && rank.contexto === contexto);
                    if (r) { acc.push(r) }
                })
                return acc;
            }, []))
            .share();

        cases.requests.forEach((obj, idx) => this._cacheRanking[this._convertIntoKey(obj)] = request.map(responses => responses.filter(rank => rank.indicador === obj.id && rank.localidade === obj.localidade && rank.contexto === obj.contexto)))

        return request;
    }


    public getRankingIndicador(indicadorId: number, periodo: string, contexto: string[], localidade: number, natureza: number = 4){

        const _contexto = contexto.join(',');

        const url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/ranking/${indicadorId}(${periodo})?appCidades=1&localidade=${localidade}&contexto=${_contexto}&natureza=${natureza}&lang=${this.idioma}`;

        return this._rankingRequest(url).map(res => {

            let listaRankingLocalidade: RankingLocalidade[] = [];
            for(let i = 0; i < contexto.length; i++){

                let rankingLocalidade: RankingLocalidade = new RankingLocalidade(indicadorId, periodo, contexto[i], localidade, res[i]);

                listaRankingLocalidade.push(rankingLocalidade);
            }

            return listaRankingLocalidade;
        });
    }

    private _obterLocalidade(id: number){

        // Se o código for de uma UF
        if(String(id).length == 2){

            return this._localidadeService.getUfByCodigo(id);
        }

        return this._localidadeService.getMunicipioByCodigo(id);
    }

    private _rankingRequest(url){

        return this._http.get(url)
            .retry(3)
            .catch(err => Observable.of({ json: () => [{ res: [] }] }))
            .map(res => res.json())
            .map(rankings => {

                return rankings.map(rankings => {

                    let grupo: ItemRanking[] = [];

                    rankings.res.map(ranking => {

                        let item = new ItemRanking(
                            this._obterLocalidade(parseInt(ranking['localidade'], 10)),
                            ranking['#'],
                            ranking['res']);

                        if(!!rankings.unidade){
                            item.fatorMultiplicativo = rankings.unidade.multiplicador;
                            item.unidadeMedida = rankings.unidade.id;
                        }

                        grupo.push(item);
                    });

                    return grupo;
                });

            });
    }

    private _convertIntoKey(obj) {
        return obj.id + '-' + obj.periodo + '-' + obj.localidade + '-' + obj.contexto;
    }

    private _getRankingsRequest(indicadoresId: number[], periodos: string[], codigoLocalidade: number, contexto: string[]): Observable<Ranking[]> {
        const query = indicadoresId.map((id, index) => `${id}(${periodos[index]})`).join('|');
        const _contexto = contexto.join(',')
        const url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/ranking/${query}?lower=0&contexto=${_contexto}&localidade=${codigoLocalidade}&lang=${this.idioma}`;

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