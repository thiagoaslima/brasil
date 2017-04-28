import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { converterObjArrayEmHash } from '../../utils2';
import { PesquisaDTO } from '../dto';
import { Indicador, Pesquisa } from '../models';
import { escopoIndicadores, listaNiveisTerritoriais, ServicoDados as servidor } from '../values';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class PesquisaService3 {

    constructor(
        private _http: Http
    ) { }

    getAllPesquisas(): Observable<Pesquisa[]> {
        const url = servidor.setUrl('pesquisas');
        const errorMessage = `Não foi possível recuperar as pesquisas`;

        return this._request(url)
            .map(arr => arr.map(Pesquisa.criar))
            .catch(err => this._handleError(new Error(errorMessage)));
    }

    getPesquisasPorAbrangenciaTerritorial(nivelTerritorial: string): Observable<Pesquisa[]> {
        const errorMessage = `Não existe o nível territorial pesquisado. Favor verifique sua solicitação. [nivelterritorial: ${nivelTerritorial}]`;

        if (listaNiveisTerritoriais.indexOf(nivelTerritorial) === -1) {
            return this._handleError(new Error(errorMessage));
        }

        return this.getAllPesquisas()
            .map(pesquisas => pesquisas.filter(pesquisa => pesquisa.abrangeNivelTerritorial(nivelTerritorial)))
            .catch(err => this._handleError(err));
    }

    getPesquisas(pesquisasId: number[]) {
        return this.getAllPesquisas()
            .map(pesquisas => {
                const hashPesquisasById = converterObjArrayEmHash(pesquisas, 'id');
                return this._filterPesquisas(hashPesquisasById, pesquisasId);
            })
            .catch(err => this._handleError(err));
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        const url = servidor.setUrl(`pesquisas/${pesquisaId}`);
        const errorMessage = `Não foi possível recuperar a pesquisa solicitada. Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]`;

        return this._request(url)
            .map(Pesquisa.criar)
            .catch(err => this._handleError(new Error(errorMessage)));
    }

    private _request(url: string) {
        return this._http.get(url, options)
            .retry(3)
            .map(res => {
                const obj = res.json();

                if (this._isServerError(obj)) {
                    throw new Error(obj.message);
                }

                return obj;
            });
    }

    private _handleError(error): Observable<any> {
        return Observable.throw(error);
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