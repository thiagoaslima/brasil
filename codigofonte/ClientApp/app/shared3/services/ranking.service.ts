import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Ranking } from '../models/ranking.model';

import { Observable } from 'rxjs/Observable';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });
@Injectable()
export class RankingService3 {

    constructor(
        private _http: Http
    ) {}

    public getRankingsIndicador(indicadores: Array<{indicadorId: number, periodo: string}>, contextos: string[], localidade: number){

        const _contexto = contextos.join(',');
        const _indicadores = indicadores.map(obj => `${obj.indicadorId}(${obj.periodo})`).join('|'); 

        const url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/ranking/${_indicadores}?localidade=${localidade}&contexto=${_contexto}&upper=0&lower=0`;

        return this._request(url).map(response => response.map(item => new Ranking(item)));
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
        return res && typeof res === 'object' && !Array.isArray(res) && Object.prototype.hasOwnProperty.apply(res, 'message') && Object.keys(res).length === 1;
    }
}