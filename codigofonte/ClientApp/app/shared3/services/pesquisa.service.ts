import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Pesquisa, PesquisaDTO } from '../models';

import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class PesquisaService3 {

    constructor(
        private _http: Http
    ) { }

    getAllPesquisas(): Promise<Pesquisa[]> {
        const url = 'http://servicodados.ibge.gov.br/api/v1/pesquisas';

        return this._http.get(url, options)
            .retry(3)
            .toPromise()
            .then(res => res.json().map(Pesquisa.criar))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    private _get(url) {
        return ;
    }
}