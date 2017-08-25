import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { ServicoDados as servidor } from '../values';

import { Observable } from 'rxjs/Observable';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class ConjunturaisService {

    constructor(
        private _http: Http
    ) { }

    getIndicador(pesquisaId: number, indicadorId: number, categoria?: string) {
        const params = categoria ? `?categoria=${categoria}` : '';
        const url = servidor.setUrl(`api/v2/conjunturais/${pesquisaId}/indicadores/${indicadorId}${params}`);
        return this._request(url).catch(err => this._handleError(err));
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

                return res.json();
            })
            .share();
    }

    private _handleError(error: Error, customError?: Error): Observable<any> {
        return Observable.throw(error.message ? error : customError);
    }
}
