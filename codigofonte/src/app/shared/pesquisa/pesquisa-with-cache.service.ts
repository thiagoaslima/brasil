import { Inject, Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';

import { CacheService } from '../cache.service';
import { SystemCacheService } from '../system-cache.service';
import { Pesquisa, Indicador } from './pesquisa.interface';
import { PesquisaService } from './pesquisa.service';

import { flatTree } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

@Injectable()
export class PesquisaServiceWithCache {

    private _instance: PesquisaService;

    constructor(
        private _cache: SystemCacheService,
        _http: Http
    ) {
        this._instance = new PesquisaService(_http);
    }

    getAllPesquisas(): Observable<Pesquisa[]> {
        let cacheKey = this._cache.buildKey.allPesquisas();
        let callback = (cacheKey, subject, pesquisas) => {
            subject.next(pesquisas);
            this._cache.set(cacheKey, pesquisas);
        }

        return this._cacheCallback('getAllPesquisas', cacheKey, callback);
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        return this._instance.getPesquisa(pesquisaId);
    }

    getListaIndicadoresDaPesquisa(pesquisaId: number): Observable<Indicador[]> {
        let cacheKey = this._cache.buildKey.listaIndicadoresDaPesquisa(pesquisaId);
        let callback = (cacheKey, subject, indicadoresTree) => {
            subject.next(indicadoresTree);
            this._cache.set(cacheKey, indicadoresTree);

            flatTree(indicadoresTree).map(indicador => {
                let cacheKey = this._cache.buildKey.indicador(pesquisaId, indicador.id);
                this._cache.set(cacheKey, indicadoresTree);
            })
        }

        return this._cacheCallback('getListaIndicadoresDaPesquisa', cacheKey, callback);
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

        let subject = new Subject<any>();

        this._instance.getListaIndicadoresDaPesquisa(pesquisaId)
            .subscribe(_ => this.getIndicadores(pesquisaId, _indicadoresId).map(indicadores => subject.next(indicadores)));

        this._cache.set(cacheKey, subject);
        return subject.asObservable();
    }

    getResultados(pesquisaId: number, localidadesCodigo: number | number[]): Observable<Indicador[]> {
        let _localidadesCodigo = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];

        let _notOnCache = _localidadesCodigo.filter(codigo => this._cache.buildKey.resultadosPesquisa(pesquisaId, codigo));

        if (_notOnCache.length === 0) {
            return this.getIndicadores(pesquisaId);
        }

        let subject = new Subject<any>();

        this._instance.getResultados(pesquisaId, _localidadesCodigo)
            .flatMap(_ => {
                _localidadesCodigo.forEach(codigo => this._cache.set(this._cache.buildKey.resultadosPesquisa(pesquisaId, codigo), true))
                return this.getIndicadores(pesquisaId);
            })
            .subscribe(indicadores => subject.next(indicadores));

        return subject.asObservable();
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

    private _cacheCallback(method: string, cacheKey: string, callback: Function): Observable<any> {
        if (this._cache.has(cacheKey)) {
            return Observable.of(this._cache.get(cacheKey));
        }

        let subject = new Subject<any>();

        this._instance[method]().subscribe((...args) => callback(cacheKey, subject, ...args));

        this._cache.set(cacheKey, subject);
        return subject.asObservable();
    }

};

