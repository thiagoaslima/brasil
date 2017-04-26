import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaDTO } from '../dto';
import { Indicador, Pesquisa } from '../models';
import { EscopoIndicadores } from '../values';

import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

function setUrl(path) { return `http://servicodados.ibge.gov.br/api/v1${path}`; }
@Injectable()
export class PesquisaService3 {

    constructor(
        private _http: Http
    ) { }

    getAllPesquisas(): Promise<Pesquisa[]> {
        const url = setUrl('/pesquisas');
        const errorMessage = `Não foi possível recuperar as pesquisas`;

        return this._request(url)
            .then(arr => arr.map(Pesquisa.criar))
            .catch(this.handleError.bind(this, errorMessage));
    }

    getPesquisa(pesquisaId: number): Promise<Pesquisa> {
        const url = setUrl(`/pesquisas/${pesquisaId}`);
        const errorMessage = `Não foi possível recuperar a pesquisa solicitada. Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]`;

        return this._request(url)
            .then(Pesquisa.criar)
            .catch(this.handleError.bind(this, errorMessage));
    }

    private _request(url: string) {
        return this._http.get(url, options)
            .retry(3)
            .toPromise()
            .then(res => {
                const obj = res.json();

                if (this._isServerError(obj)) {
                    throw new Error(obj.message);
                }

                return obj;
            });
    }

    private handleError(message, error): Promise<any> {
        return Promise.reject(message || error.message || error);
    }

    private _isServerError(res) {
        return Object.keys(res).length === 1 && Object.prototype.hasOwnProperty.apply(res, 'message');
    }

}