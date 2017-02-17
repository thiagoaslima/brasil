import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Periodo, Pesquisa, Indicador, ResultadoServer } from './pesquisa.interface';
import { slugify } from '../../utils/slug';
import { flatTree } from '../../utils/flatFunctions';
import { BASES, PESQUISAS } from '../../global-config';

import { SystemCacheService } from '../system-cache.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/zip';

@Injectable()
export class PesquisaService {

    private _server = {
        path: this._bases.default.base
    }

    constructor(
        private _cache: SystemCacheService,
        private _pesquisas: PESQUISAS,
        private _bases: BASES,
        private _http: Http
    ) { 
        // let _this = this;
        // Object.defineProperty(Indicador.prototype, 'getPesquisa', {
        //     value: function() {
        //         return _this.getPesquisaSync(this.pesquisaId);
        //     }
        // });
    }

    getPesquisaSync(pesquisaId) {
        return this._cache.get('pesquisas').reduce((agg, pesquisa) => pesquisa.id.toString() === pesquisaId.toString() ? pesquisa : agg, null);
    }

    getAllPesquisas(): Observable<Pesquisa[]> {
        let cacheKey = this._cache.buildKey.allPesquisas();

        if (this._cache.has(cacheKey)) {
            let value = this._cache.get(cacheKey);
            return Observable.of(value);
        }

        return this._http.get(this._server.path('pesquisas'))
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => json.filter(pesquisa => this._pesquisas.isValida(pesquisa.id)))
            .map(json => json.map(pesquisa => new Pesquisa(pesquisa)))
            .do(pesquisas => this._cache.set(cacheKey, pesquisas));
    }

    getPesquisa(pesquisaId: number|string): Observable<Pesquisa> {
        return this.getAllPesquisas()
            .filter(res => res.length > 0)
            .map(json => json.reduce((agg, pesquisa) => pesquisa.id.toString() === pesquisaId.toString() ? pesquisa : agg, null))

    }

    getListaIndicadoresDaPesquisa(pesquisaId: number|string): Observable<Indicador[]> {
        // let listaCacheKey = this._cache.buildKey.listaIndicadoresDaPesquisa(pesquisaId);
        // let hashCacheKey = this._cache.buildKey.hashIndicadoresDaPesquisa(pesquisaId);

        // if (this._cache.has(listaCacheKey)) {
        //     let value = this._cache.get(listaCacheKey);
        //     return Observable.of(value);
        // }

        return this._http.get(this._server.path(`pesquisas/${pesquisaId}/periodos/all/indicadores`))
            .retry(3)
            .catch(err => {
                return Observable.of({ json: () => [] });
            })
            .map(res => res.json())
            .zip(this.getPesquisa(pesquisaId), (json, pesquisa) => {
                return json.map(indicador => this._createIndicadoresInstance(indicador, pesquisa))
            })
            .do((indicadoresTree) => {
                // this._cache.set(listaCacheKey, indicadoresTree);
                // this._cache.set(hashCacheKey, flatTree(indicadoresTree).reduce((hash, indicador) => Object.assign(hash, { [indicador.id]: indicador }), {}))
            });;
    }

    getIndicadores(pesquisaId: number, indicadoresId?: number | number[]): Observable<Indicador[]> {
        if (!indicadoresId) {
            return this.getListaIndicadoresDaPesquisa(pesquisaId);
        }

        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        // como o cache de indicadores é feito a partir da lista de indicadores por pesquisa
        // se 1 indicador estiver no cache, todos estarão!
        // let hashCacheKey = this._cache.buildKey.hashIndicadoresDaPesquisa(pesquisaId);

        // if (this._cache.has(hashCacheKey)) {
        //     let hash = this._cache.get(hashCacheKey);
        //     return Observable.of(_indicadoresId.map(id => hash[id]));
        // }

        return this.getListaIndicadoresDaPesquisa(pesquisaId)
            .map(indicadores => {
                return flatTree(indicadores).filter(indicador => _indicadoresId.indexOf(indicador.id) > -1);
            });
    }

    getResultados(pesquisaId: number, localidadesCodigo: number | number[]): Observable<Indicador[]> {
        console.warn('PesquisaService#getResultados@Deprecated: use getDadosIndicadores instead');

        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];

        let url = this._server.path(`pesquisas/${pesquisaId}/periodos/all/resultados?localidade=${_localidadesCodigoArray.join(',')}`);

        let resultados$ = this._http.get(url).map(res => res.json());
        let indicadores$ = this.getIndicadores(pesquisaId);


        return Observable.zip(indicadores$, resultados$)
            .map(([indicadores, resultados]) => {
                let hashRes = resultados.reduce((agg, resultado) => {
                    agg[resultado.id] = resultado;
                    return agg;
                }, {});

                flatTree(indicadores).forEach(indicador => {
                    // nem todos os indicadores possuem valores
                    return hashRes[indicador.id]
                        ? indicador.saveResultados(hashRes[indicador.id].res)
                        : indicador
                });

                return indicadores;
            });
    }

    getDadosIndicadores(pesquisaId: number, localidadesCodigo: number | number[], indicadoresId?: number | number[]): Observable<Indicador[]> {
        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];
        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];    

        return Observable.zip(
            this.getListaIndicadoresDaPesquisa(pesquisaId),
            this.getOnlyResults(pesquisaId, localidadesCodigo)
        ).map(([indicadores, results]) => {
            let _indicadores = flatTree(indicadores).reduce((agg, ind) => Object.assign(agg, {[ind.id]: ind}), {});

            results.forEach(result => {
                let indicador = _indicadores[result.id]
                if (indicador) {
                    indicador.saveResultados(result.res);
                }
            });

            return _indicadoresId.map(id => _indicadores[id]);
        });
    }

    getOnlyResults(pesquisaId: number, localidadesCodigo: number | number[]): Observable<ResultadoServer[]> {
        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        let url = this._server.path(`pesquisas/${pesquisaId}/periodos/all/resultados?localidade=${_localidadesCodigoArray.join(',')}`);

        return this._http.get(url)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json());
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
                pesquisa: pesquisa,
                parentId
            }
        ))
    }

}

