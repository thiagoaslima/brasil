import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaDTO } from '../dto';
import { Indicador, Pesquisa } from '../models';
import { escopoIndicadores, listaNiveisTerritoriais } from '../values';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

function setUrl(path) { return `http://servicodados.ibge.gov.br/api/v1${path}`; }

@Injectable()
export class PesquisaService3 {

    constructor(
        private _http: Http
    ) { }

    getAllPesquisas(): Observable<Pesquisa[]> {
        const url = setUrl('/pesquisas');
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

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        const url = setUrl(`/pesquisas/${pesquisaId}`);
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

}
