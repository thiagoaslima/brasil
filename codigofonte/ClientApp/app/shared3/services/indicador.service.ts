import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaService3 } from './';
import { Indicador, Pesquisa } from '../models';
import { escopoIndicadores } from '../values';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

function setUrl(path) { return `http://servicodados.ibge.gov.br/api/v1${path}`; }

@Injectable()
export class IndicadorService3 {

    constructor(
        private _http: Http,
        private _pesquisaService: PesquisaService3
    ) { }

    getIndicadoresDaPesquisa(pesquisaId: number, arvoreCompleta = false, comPesquisa = false) {
        const url = arvoreCompleta 
            ? setUrl(`/pesquisas/${pesquisaId}/periodos/all/indicadores`)
            : setUrl(`/pesquisas/${pesquisaId}/periodos/all/indicadores/0?scope=${escopoIndicadores.filhos}`);

        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}]`;
        
        if (comPesquisa) {
            return Observable.forkJoin(this._request(url), this._pesquisaService.getPesquisa(pesquisaId))
        }
        
        return this._request(url)
            .map(arr => arr.map(obj => Indicador.criar(Object.assign(obj, { pesquisa_id: pesquisaId }))))
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
