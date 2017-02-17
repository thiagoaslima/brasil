import { Inject, Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { isBrowser, isNode } from 'angular2-universal/browser';

import { CacheService } from '../cache.service';
import { SystemCacheService } from '../system-cache.service';
import { Pesquisa, Indicador, ResultadoServer } from './pesquisa.interface';
import { PesquisaService } from './pesquisa.service';
import { BASES, PESQUISAS } from '../../global-config';

import { flatTree } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';

@Injectable()
export class PesquisaServiceWithCache {

    private _instance: PesquisaService;
    private _server = {
        path: this._bases.default.base
    }

    constructor(
        private _cache: SystemCacheService,
        private _pesquisas: PESQUISAS,
        private _bases: BASES,
        private _http: Http
    ) { }

    getAllPesquisas(): Observable<Pesquisa[]> {
        let cacheKey = this._cache.buildKey.allPesquisas();

        if (this._cache.has(cacheKey)) {
            let value = this._cache.get(cacheKey);
            return Observable.of(value);
        }

        return this._getAllPesquisas()
            .do(pesquisas => this._cache.set(cacheKey, pesquisas));
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        return this.getAllPesquisas()
            .map(pesquisas => pesquisas.reduce((res, pesquisa) => pesquisa.id === pesquisaId ? pesquisa : res, null));
    }

    getListaIndicadoresDaPesquisa(pesquisaId: number): Observable<Indicador[]> {
        let listaCacheKey = this._cache.buildKey.listaIndicadoresDaPesquisa(pesquisaId);
        let hashCacheKey = this._cache.buildKey.hashIndicadoresDaPesquisa(pesquisaId);

        if (this._cache.has(listaCacheKey)) {
            let value = this._cache.get(listaCacheKey);
            return Observable.of(value);
        }

        return this._getListaIndicadoresDaPesquisa(pesquisaId)
            .do((indicadoresTree) => {
                this._cache.set(listaCacheKey, indicadoresTree);
                this._cache.set(hashCacheKey, flatTree(indicadoresTree).reduce((hash, indicador) => Object.assign(hash, { [indicador.id]: indicador }), {}))
            });
    }

    getIndicadores(pesquisaId: number, indicadoresId?: number | number[]): Observable<Indicador[]> {
        if (!indicadoresId) {
            return this.getListaIndicadoresDaPesquisa(pesquisaId);
        }

        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        // como o cache de indicadores é feito a partir da lista de indicadores por pesquisa
        // se 1 indicador estiver no cache, todos estarão!
        let hashCacheKey = this._cache.buildKey.hashIndicadoresDaPesquisa(pesquisaId);

        if (this._cache.has(hashCacheKey)) {
            let hash = this._cache.get(hashCacheKey);
            return Observable.of(_indicadoresId.map(id => hash[id]));
        }

        return this.getListaIndicadoresDaPesquisa(pesquisaId)
            .flatMap(_ => this.getIndicadores(pesquisaId, _indicadoresId));
    }

    getResultados(pesquisaId: number, localidadesCodigo: number | number[]): Observable<Indicador[]> {
        console.warn('PesquisaServiceWithCache.getResultados@Deprecated: use getDadosIndicadores instead');

        return this.getDadosIndicadores(pesquisaId, localidadesCodigo);
      
    }

    getDadosIndicadores(pesquisaId: number, localidadesCodigo: number | number[], indicadoresId?: number | number[]): Observable<Indicador[]> {
        let _localidadesCodigo = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        let _notOnCache = _localidadesCodigo.filter(codigo => this._cache.buildKey.resultadosPesquisaLocalidade(pesquisaId, codigo));

        if (_notOnCache.length === 0) {
            return this.getIndicadores(pesquisaId, indicadoresId);
        }

        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];
        let listaCacheKey = this._cache.buildKey.listaIndicadoresDaPesquisa(pesquisaId);
        let hashCacheKey = this._cache.buildKey.hashIndicadoresDaPesquisa(pesquisaId);
        let indicadores$ = this._cache.has(listaCacheKey)
            ? Observable.of(this._cache.get(listaCacheKey))
            : this.getListaIndicadoresDaPesquisa(pesquisaId);

        return Observable.zip(
            indicadores$,
            this._getOnlyResults(pesquisaId, localidadesCodigo)
        )
            .map(([indicadores, results]) => {
                let hash = this._cache.get(hashCacheKey);

                results.forEach(result => {
                    let indicador: Indicador = hash[result.id];
                    indicador.saveResultados(result.res);
                });

                if (_indicadoresId) {
                    return _indicadoresId.map(id => hash[id]);
                } else {
                    return indicadores;
                }
            });
    }

    private _getAllPesquisas(): Observable<Pesquisa[]> {
        return this._http.get(this._server.path('pesquisas'))
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => json.filter(pesquisa => this._pesquisas.isValida(pesquisa.id)))
            .map(json => json.map(pesquisa => new Pesquisa(pesquisa)))
    }

    private _getOnlyResults(pesquisaId: number, localidadesCodigo: number | number[]): Observable<ResultadoServer[]> {
        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        let url = this._server.path(`pesquisas/${pesquisaId}/periodos/all/resultados?localidade=${_localidadesCodigoArray.join(',')}`);

        return this._http.get(url)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json());
    }

    private _getListaIndicadoresDaPesquisa(pesquisaId: number): Observable<Indicador[]> {
        return this._http.get(this._server.path(`pesquisas/${pesquisaId}/periodos/all/indicadores`))
            .retry(3)
            .catch(err => {
                return Observable.of({ json: () => [] });
            })
            .map(res => res.json())
            .zip(this.getPesquisa(pesquisaId), (json, pesquisa) => {
                return json.map(indicador => this._createIndicadoresInstance(indicador, pesquisa))
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

};

