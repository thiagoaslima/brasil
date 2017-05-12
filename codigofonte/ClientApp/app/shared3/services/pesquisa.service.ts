import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { converterObjArrayEmHash } from '../../utils2';
import { PesquisaDTO } from '../dto';
import { Indicador, Pesquisa } from '../models';
import { escopoIndicadores, listaNiveisTerritoriais, ServicoDados as servidor } from '../values';
import { CacheFactory } from '../../cache/cacheFactory.service';
import { RxCache, RxGetAllCache, RxMultiCache } from '../../cache/decorators';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

const pesquisaCache = CacheFactory.createCache('PesquisaCache', 50);

@Injectable()
export class PesquisaService3 {

    constructor(
        private _http: Http
    ) { }

    @RxGetAllCache({
        cache: pesquisaCache,
        labelsFromResponse: (pesquisas) => pesquisas.map(pesquisa => pesquisa.id)
    })
    getAllPesquisas(): Observable<Pesquisa[]> {
        const url = servidor.setUrl('pesquisas');
        const errorMessage = `Não foi possível recuperar as pesquisas`;

        return this._request(url)
            .map(arr => arr.map(Pesquisa.criar))
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }

    @RxCache({
        cache: pesquisaCache
    })
    getPesquisasPorAbrangenciaTerritorial(nivelTerritorial: string): Observable<Pesquisa[]> {
        if (Pesquisa.niveisTerritoriaisPossiveis.indexOf(nivelTerritorial) === -1) {
            const errorMessage = `Não existe o nível territorial pesquisado. Favor verifique sua solicitação. [nivelterritorial: ${nivelTerritorial}]`;
            return this._handleError(new Error(errorMessage));
        }

        return this.getAllPesquisas()
            .map(pesquisas => pesquisas.filter(pesquisa => pesquisa.abrangeNivelTerritorial(nivelTerritorial)))
            .catch(err => this._handleError(err));
    }

    @RxMultiCache({
        cache: pesquisaCache,
        labelsFromArguments: (ids) => ids,
        labelsFromResponse: (pesquisas) => pesquisas.map(pesquisa => pesquisa.id)
    })
    getPesquisas(pesquisasId: number[]): Observable<Pesquisa[]> {
        return this.getAllPesquisas()
            .map(pesquisas => {
                const hashPesquisasById = converterObjArrayEmHash(pesquisas, 'id');
                return this._filterPesquisas(hashPesquisasById, pesquisasId);
            })
            .catch(err => this._handleError(err));
    }

    @RxCache({
        cache: pesquisaCache,
        labelFromArguments: (id) => id
    })
    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        const url = servidor.setUrl(`pesquisas/${pesquisaId}`);
        const errorMessage = `Não foi possível recuperar a pesquisa solicitada. Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]`;

        return this._request(url)
            .map(Pesquisa.criar)
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }

    private _request(url: string): Observable<any> {
        return this._http.get(url, options)
            .retry(3)
            .map(res => {
                if (res.status === 404) {
                    throw new Error(`Não foi encontrado o endereço solicitado. [url: ${url}]`);
                }

                if (res.status === 400 || res.status === 500) {
                    throw new Error();
                }

                const obj = res.json();
                if (this._isServerError(obj)) {
                    throw new Error();
                }

                return obj;
            });
    }

    private _handleError(error: Error, customError?: Error): Observable<any> {
        return Observable.throw(error.message ? error : customError);
    }

    private _isServerError(res) {
        return Object.keys(res).length === 1 && Object.prototype.hasOwnProperty.apply(res, 'message');
    }

    private _filterPesquisas(hash, pesquisasId) {
        const obj = pesquisasId.reduce((acc, id) => {
            if (hash[id]) {
                acc.pesquisas.push(hash[id])
            } else {
                acc.errors.push(id);
            }
            return acc;
        }, { pesquisas: [] as Pesquisa[], errors: [] as number[] })

        if (obj.errors.length > 0) {
            throw new Error(`Não foram encontradas todas as pesquisas solicitadas. [ids: ${obj.errors.join(', ')}]`)
        }

        return obj.pesquisas;
    }
}