import { Inject, Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { isBrowser, isNode } from 'angular2-universal/browser';

import { CacheService } from '../cache.service';
import { SystemCacheService } from '../system-cache.service';
import { Pesquisa, Indicador } from './pesquisa.interface';
import { PesquisaService } from './pesquisa.service';

import { flatTree } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/multicast';

@Injectable()
export class PesquisaServiceWithCache {

    private _instance: PesquisaService;

    constructor(
        private _cache: SystemCacheService,
        _http: Http
    ) {
        this._instance = new PesquisaService(_http);
    }

    private _subjects = <{ [idx: string]: Observable<any> }>{};

    getAllPesquisas(): Observable<Pesquisa[]> {
        let cacheKey = this._cache.buildKey.allPesquisas();

        if (this._cache.has(cacheKey)) {
            let value = this._cache.get(cacheKey);
            return Observable.of(value);
        }

        if (this._subjects[cacheKey]) {
            return this._subjects[cacheKey];
        }

        let pesquisas$ = this._instance.getAllPesquisas()
            .finally(() => {
                this._subjects[cacheKey] = null;
                pesquisas$ = null;
            });

        let _observable = pesquisas$.multicast(() => new ReplaySubject<Pesquisa[]>(1));

        this._subjects[cacheKey] = _observable;
        _observable.connect();

        return _observable;
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        return this._instance.getPesquisa(pesquisaId);
    }

    getListaIndicadoresDaPesquisa(pesquisaId: number): Observable<Indicador[]> {
        let cacheKey = this._cache.buildKey.listaIndicadoresDaPesquisa(pesquisaId);

        if (this._cache.has(cacheKey)) {
            let value = this._cache.get(cacheKey);
            return Observable.of(value);
        }

        if (this._subjects[cacheKey]) {
            return this._subjects[cacheKey];
        }

        let lista$ = this._instance.getListaIndicadoresDaPesquisa(pesquisaId)
            .finally(() => this._subjects[cacheKey] = null)
            .do((indicadoresTree) => {
                this._cache.set(cacheKey, indicadoresTree);

                flatTree(indicadoresTree).map(indicador => {
                    let cacheKey = this._cache.buildKey.indicador(pesquisaId, indicador.id);
                    this._cache.set(cacheKey, indicador);
                })

                return indicadoresTree;
            }
            );

        let _observable = lista$.multicast(() => new ReplaySubject<Indicador[]>(1));
        this._subjects[cacheKey] = _observable;

        _observable.connect();

        return _observable;
    }

    getIndicadores(pesquisaId: number, indicadoresId?: number | number[]): Observable<Indicador[]> {

        if (!indicadoresId) {
            return this.getListaIndicadoresDaPesquisa(pesquisaId);
        }

        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        // como o cache de indicadores é feito a partir da lista de indicadores por pesquisa
        // se 1 indicador estiver no cache, todos estarão!
        let cacheKey = this._cache.buildKey.indicador(pesquisaId, _indicadoresId[0]);

        if (this._cache.has(cacheKey)) {
            let resp: Indicador[] = _indicadoresId.map(id => this._cache.get(this._cache.buildKey.indicador(pesquisaId, id)));
            return Observable.of(resp);
        }

        return this._instance.getListaIndicadoresDaPesquisa(pesquisaId)
            .flatMap(_ => this.getIndicadores(pesquisaId, _indicadoresId));
    }

    getResultados(pesquisaId: number, localidadesCodigo: number | number[]): Observable<Indicador[]> {
        let _localidadesCodigo = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];

        let _notOnCache = _localidadesCodigo.filter(codigo => this._cache.buildKey.resultadosPesquisaLocalidade(pesquisaId, codigo));

        if (_notOnCache.length === 0) {
            return this.getIndicadores(pesquisaId);
        }

        return this._instance.getResultados(pesquisaId, _localidadesCodigo)
            .flatMap(_ => {
                _localidadesCodigo.forEach(codigo => this._cache.set(this._cache.buildKey.resultadosPesquisaLocalidade(pesquisaId, codigo), true))
                return this.getIndicadores(pesquisaId);
            });
    }

    getDadosIndicadores(pesquisaId: number, localidadesCodigo: number | number[], indicadoresId?: number | number[]): Observable<Indicador[]> {
        return this.getResultados(pesquisaId, localidadesCodigo)
            .flatMap(indicadores => {

                if (!indicadoresId) {
                    return Observable.of(indicadores);
                }

                let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];
                return this.getIndicadores(pesquisaId, _indicadoresId);
            });
    }

};

