import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Resultado } from '../models';
import { ServicoDados as servidor } from '../values';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });
@Injectable()
export class ResultadoService3 {

    constructor(
        private _http: Http
    ) { }

    getResultados(indicadoresId: number | number[], codigolocalidades: number | number[]) {
        const _indicadores = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];
        const _localidades = Array.isArray(codigolocalidades) ? codigolocalidades : [codigolocalidades];
        const url = servidor.setUrl(`pesquisas/indicadores/${_indicadores.join('|')}/resultados/${_localidades.join('|')}`);
        const errorMessage = `Não foi possível recuperar os resultados solicitados. [indicadores: ${_indicadores.join(', ')}, localidades: ${_localidades.join(', ')}]`

        return this._request(url)
            .map(json => Resultado.convertDTOintoParameters(json).map(Resultado.criar))
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }
    private _request(url: string) {
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
            })
            .share();
    }

    private _handleError(error: Error, customError?: Error): Observable<any> {
        return Observable.throw(error.message ? error : customError);
    }

    private _isServerError(res) {
        return !Array.isArray(res) && Object.keys(res).length === 1 && Object.prototype.hasOwnProperty.apply(res, 'message');
    }
}