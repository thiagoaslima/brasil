import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaService3 } from '.';
import { Indicador, Pesquisa } from '../models';
import { escopoIndicadores, ServicoDados as servidor } from '../values';
import { arrayUniqueValues, converterObjArrayEmHash } from '../../utils2';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class IndicadorService3 {

    constructor(
        private _http: Http,
        private _pesquisaService: PesquisaService3
    ) { }

    getIndicadoresDaPesquisa(pesquisaId: number, { arvoreCompleta = false, comPesquisa = false } = {}) {
        const url = arvoreCompleta
            ? servidor.setUrl(`pesquisas/${pesquisaId}/periodos/all/indicadores`)
            : servidor.setUrl(`pesquisas/${pesquisaId}/periodos/all/indicadores/0?scope=${escopoIndicadores.filhos}`);

        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}]`;

        if (comPesquisa) {
            return Observable.zip(this._request(url), this._pesquisaService.getPesquisa(pesquisaId))
                .map(([arr, pesquisa]) => arr.map(obj => Indicador.criar(Object.assign(obj, { pesquisa: pesquisa }))))
                .catch(err => this._handleError(new Error(errorMessage)));
        }

        return this._request(url)
            .map(arr => arr.map(obj => Indicador.criar(Object.assign(obj, { pesquisa_id: pesquisaId }))))
            .catch(err => this._handleError(new Error(errorMessage)));

    }

    getIndicadoresById(indicadoresId: number[], { comPesquisa = false } = {}) {
        const url = servidor.setUrl(`pesquisas/indicadores/${indicadoresId.join('|')}`);

        if (comPesquisa) {
            const request$ = this._request(url);
            const pesquisas$ = request$
             .mergeMap(array => {
                 const pesquisasId = arrayUniqueValues(array.map(obj => obj.pesquisa_id));
                 return this._pesquisaService.getPesquisas(pesquisasId);
            })
             .map((array) => {
                 return converterObjArrayEmHash(array, 'id');
            })

             return Observable.zip(request$, pesquisas$)
                 .map( ([array, hashPesquisas]) => {
                     return array.map(obj => Indicador.criar(Object.assign(obj, {pesquisa: hashPesquisas[obj.pesquisa_id]})))
                 })
                 .catch(err => this._handleError(err));
        }

        return this._request(url).map(array => array.map(Indicador.criar))
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
            })
            .share();
    }

    private _handleError(error): Observable<any> {
        return Observable.throw(error);
    }

    private _isServerError(res) {
        return Object.keys(res).length === 1 && Object.prototype.hasOwnProperty.apply(res, 'message');
    }
}
