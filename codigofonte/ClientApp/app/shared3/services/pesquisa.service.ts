import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaDTO } from '../dto';
import { Pesquisa } from '../models';

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

    getPesquisa(pesquisaId: number): Promise<Pesquisa> {
        const url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}`;

        return this._http.get(url, options)
            .retry(3)
            .toPromise()          
            .then(res => {
                const obj = res.json(); 

                if (obj.message) {
                    throw new Error(`
                        Não foi possível recuperar a pesquisa solicitada. 
                        Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]
                    `)
                }
                return Pesquisa.criar(obj);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}