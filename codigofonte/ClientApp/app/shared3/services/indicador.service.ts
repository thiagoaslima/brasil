import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaService3 } from './';
import { Indicador, Pesquisa } from '../models';
import { EscopoIndicadores } from '../values';

import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

function setUrl(path) { return `http://servicodados.ibge.gov.br/api/v1${path}`; }

@Injectable()
export class IndicadorService3 {

    constructor(
        private _http: Http,
        private _pesquisaService: PesquisaService3
    ) {}

    getIndicadoresDaPesquisa(pesquisaId: number, arvoreCompleta = false, comPesquisa = false): Promise<Indicador[]> {
        const escopo = arvoreCompleta ? EscopoIndicadores.filhos : EscopoIndicadores.arvoreCompleta
        const url = setUrl(`/pesquisas/${pesquisaId}/periodos/all/indicadores?scope=${escopo}`);

        return Promise.all([
            this._request(url),
            comPesquisa ? this._pesquisaService.getPesquisa(pesquisaId) : Promise.resolve({} as Pesquisa)
        ]).then( ([res, pesquisa]) => {
            let indicadores;

            if (comPesquisa) {
                indicadores = res.map()
            }
        })
            
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

    private _handleError(message, error): Promise<any> {
        return Promise.reject(message || error.message || error);
    }

    private _isServerError(res) {
        return Object.keys(res).length === 1 && Object.prototype.hasOwnProperty.apply(res, 'message');
    }
}