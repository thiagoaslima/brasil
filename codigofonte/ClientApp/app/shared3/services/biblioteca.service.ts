import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { ServicoDados as servidor } from '../values';

import { Observable } from 'rxjs/Observable';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class BibliotecaService {

    constructor(
        private _http: Http
    ) { }

    public getValues(codigoLocalidade: number) {
        const url = servidor.setUrl(`biblioteca?aspas=3&codmun=${codigoLocalidade}`);
        return this._request(url).map(res => res[Object.keys(res)[0]]);
    }

    private _request(url: string) {
        return this._http.get(url, options)
            .retry(3)
            .map(res => {
                if (res.status === 404) {
                    throw new Error(`Não foi encontrado o endereço solicitado. [url: ${url}]`);
                }

                if (res.status === 400 || res.status === 500) {
                    throw new Error(res.status.toString(10));
                }

                return res.json();
            })
            .share();
    }

    private _handleError(error: Error, customError?: Error): Observable<any> {
        return Observable.throw(error.message ? error : customError);
    }

}
