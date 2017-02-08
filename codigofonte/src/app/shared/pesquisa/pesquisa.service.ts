import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CacheService } from '../cache.service';
import { Periodo, Pesquisa, Indicador, Resultado } from './pesquisa.interface';
import { slugify } from '../../utils/slug';
import { flatTree } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Injectable()
export class PesquisaService {

    private _server = {
        path(str) {
            return `http://servicodados.ibge.gov.br/api/v1/${str}`;
        }
    }

    private _cacheKeys = {
        "allPesquisas": () => "pesquisas",
        "pesquisa": (pesquisaId: number) => `pesquisas/${pesquisaId}`,
        "listaIndicadores": (pesquisaId: number) => `pesquisas/${pesquisaId}/indicadores`,
        "indicador": (pesquisaId: number, indicadorId: number) => `pesquisas/${pesquisaId}/indicadores/${indicadorId}`,
        "resultados": (pesquisaId: number, localidadeId: number, indicadorId: number) => `pesquisas/${pesquisaId}/indicadores/${indicadorId}/resultados?localidade=${localidadeId}`,
        "resultadosPesquisa": (pesquisaId: number, localidadeId: number) => `pesquisas/${pesquisaId}/resultados`,
        "busca": (termo: string) => `busca/${termo}`
    }

    constructor(
        private _cache: CacheService,
        private _http: Http
    ) { }

    getAllPesquisas(): Observable<Pesquisa[]> {
        let cacheKey = this._cacheKeys.allPesquisas();

        if (this._cache.has(cacheKey)) {
            return Observable.of(this._cache.get(cacheKey));
        }

        return this._http.get(this._server.path('pesquisas'))
            .retry(3)
            .map(res => res.json())
            .map(json => json.map(pesquisa => new Pesquisa(pesquisa)))
            .map(json => {
                this._cache.set(cacheKey, json);
                return json;
            })
            .catch(err => {
                debugger;
                return Observable.of([]);
            });
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        const cacheKey = this._cacheKeys.pesquisa(pesquisaId);

        if (this._cache.has(cacheKey)) {
            return Observable.of(this._cache.get(cacheKey));
        }

        return this.getAllPesquisas()
            .filter(res => res.length > 0)
            .map(json => json.reduce((agg, pesquisa) => pesquisa.id === pesquisaId ? pesquisa : agg, null))
            .map(pesquisa => {
                this._cache.set(cacheKey, pesquisa);
                return pesquisa;
            });
    }

    getIndicadores(pesquisaId: number, indicadoresId?: number | number[]): Observable<{ pesquisa: Pesquisa, indicadores: Indicador[] }> {
        if (!indicadoresId) {
            return this._getListaIndicadoresDaPesquisa(pesquisaId);
        }

        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        let isOnCache = this._cache.has(this._cacheKeys.indicador(pesquisaId, _indicadoresId[0]));
        let indicadores: Observable<Indicador[]>;

        if (isOnCache) {
            indicadores = Observable.of(this._getIndicadoresFromCache(pesquisaId, _indicadoresId));
        } else {
            indicadores = this._getListaIndicadoresDaPesquisa(pesquisaId)
                .map(_ => this._getIndicadoresFromCache(pesquisaId, _indicadoresId));
        }

        return Observable.zip<Pesquisa, Indicador[]>(this.getPesquisa(pesquisaId), indicadores)
            .map(([pesquisa, indicadores]) => ({ pesquisa, indicadores }));

    }

    getResultados(pesquisaId: number, localidadesCodigo: number | number[]) {
        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        const isOnCache = _localidadesCodigoArray.every(localidadeCodigo => this._cache.has(this._cacheKeys.resultadosPesquisa(pesquisaId, localidadeCodigo)));

        if (isOnCache) {
            return this.getIndicadores(pesquisaId);
        }

        let url = this._server.path(`pesquisas/${pesquisaId}/periodos/all/resultados?localidade=${_localidadesCodigoArray.join(',')}`);

        let indicadores = this._http.get(url)
            .map(res => res.json())
            .switchMap(json => {
                return json.map(obj => {
                    debugger;
                    return this.getIndicadores(pesquisaId, obj.id)
                        .map(({indicadores}) => {
                            debugger;
                            return indicadores[0].saveResultados(obj.res)
                        })
                        .map(indicador => {
                            debugger;
                            _localidadesCodigoArray.forEach(localidadeCodigo => {
                                debugger;
                                let cacheKey = this._cacheKeys.resultados(pesquisaId, localidadeCodigo, indicador.id);
                                this._cache.set(cacheKey, true);
                            });
                            return indicador;
                        });
                });
            })
            .map(indicadores => {
                _localidadesCodigoArray.forEach(localidadeCodigo => {
                    let cacheKey = this._cacheKeys.resultadosPesquisa(pesquisaId, localidadeCodigo);
                    this._cache.set(cacheKey, true);
                });
                return indicadores;
            });

        return Observable.zip<Pesquisa, Indicador[]>(this.getPesquisa(pesquisaId), indicadores)
            .map(([pesquisa, indicadores]) => ({ pesquisa, indicadores }));
    }

    getDadosIndicadores(pesquisaId: number, localidadesCodigo: number | number[], indicadoresId?: number | number[]): Observable<{ pesquisa: Pesquisa, indicadores: Indicador[] }> {
        if (!indicadoresId) {
            return this.getResultados(pesquisaId, localidadesCodigo);
        }

        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        let _indicadoresIdArray = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        let whithoutData = {};

        _localidadesCodigoArray.forEach(localidadeCodigo => {
            _indicadoresIdArray.forEach(indicadorId => {
                let cacheKey = this._cacheKeys.resultados(pesquisaId, localidadeCodigo, indicadorId);
                if (!this._cache.has(cacheKey)) {
                    whithoutData[indicadorId] = true;
                }
            });
        });

        if (Object.keys(whithoutData).length === 0) {
            return this.getIndicadores(pesquisaId, _indicadoresIdArray);
        }

        let _indicadoresRequest = Object.keys(whithoutData).map(str => parseInt(str, 10));

        const indicadores$ = this.getIndicadores(pesquisaId, _indicadoresRequest);
        const resultados$ = this._http.get(this._server.path(`pesquisas/${pesquisaId}/periodos/all/resultados?localidade=${_localidadesCodigoArray.join(',')}&indicadores=${_indicadoresRequest.join(',')}`))
            .retry(3)
            .map(res => res.json());

        const merge$ = Observable.zip(indicadores$, resultados$)
            .map(([{pesquisa, indicadores}, resultados]) => {

                let hashIndicadores = indicadores.reduce((agg, ind) => {
                    agg[ind.id] = ind;
                    return agg;
                }, <{ [idx: number]: Indicador }>{});

                resultados.forEach(resultado => {
                    let indicador = hashIndicadores[resultado.id];
                    indicador.saveResultados(resultado.res);
                    _localidadesCodigoArray.forEach(localidadeCodigo => {
                        let cacheKey = this._cacheKeys.resultados(pesquisaId, localidadeCodigo, indicador.id);
                        this._cache.set(cacheKey, true);
                    });
                });

                return indicadores;
            })
            .catch(err => {
                debugger;
                return Observable.of(<Indicador[]>[]);
            });

        return Observable.zip(this.getPesquisa(pesquisaId), merge$)
            .map(([pesquisa, indicadores]) => ({ pesquisa, indicadores }));
    }

    private _getListaIndicadoresDaPesquisa(pesquisaId: number): Observable<{ pesquisa: Pesquisa, indicadores: Indicador[] }> {
        const cacheKey = this._cacheKeys.listaIndicadores(pesquisaId);

        if (this._cache.has(cacheKey)) {
            return Observable.zip<Indicador[], Pesquisa>(Observable.of(this._cache.get(cacheKey)), this.getPesquisa(pesquisaId))
                .map(([indicadores, pesquisa]) => {
                    if (!Indicador.is(indicadores[0])) {
                        indicadores = indicadores.map(indicador => this._createIndicadoresInstance(indicador, pesquisa));
                    }

                    return { indicadores, pesquisa }
                });
        }

        let indicadores = this._http.get(this._server.path(`pesquisas/${pesquisaId}/periodos/all/indicadores`))
            .retry(3)
            .map(res => res.json())
            .zip(this.getPesquisa(pesquisaId), (json, pesquisa) => json.map(indicador => this._createIndicadoresInstance(indicador, pesquisa)))
            .map(indicadores => { debugger; this._cache.set(cacheKey, indicadores); return indicadores; })
            .map(indicadores => {
                debugger;
                console.log(indicadores);
                indicadores.forEach(indicador => {
                    console.log(indicador);
                    flatTree(indicador).forEach(indicador => {
                        console.log('flat', indicador);
                        debugger;
                        let cacheKey = this._cacheKeys.indicador(pesquisaId, indicador.id);
                        this._cache.set(cacheKey, indicador);
                    });
                });

                return indicadores;
            })
            .catch(err => {
                debugger;
                return Observable.of([]);
            });

        return Observable.zip<Pesquisa, Indicador[]>(this.getPesquisa(pesquisaId), indicadores)
            .map(([pesquisa, indicadores]) => {
                debugger;
                return { pesquisa, indicadores: this._cache.get(cacheKey) }
            });
    }

    private _createIndicadoresInstance(protoIndicador, pesquisa, parentId = 0) {
        let children = [];

        if (protoIndicador.children.length) {
            children = protoIndicador.children.map(child => this._createIndicadoresInstance(child, pesquisa, protoIndicador.id));
        }

        return new Indicador(Object.assign(
            {},
            protoIndicador,
            {
                children,
                pesquisa,
                parentId
            }
        ))
    }

    private _getIndicadoresFromCache(pesquisaId, indicadoresId: number[]): Indicador[] {
        return indicadoresId.map(id => this._cache.get(this._cacheKeys.indicador(pesquisaId, id)));
    }
}

