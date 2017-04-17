import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaConfiguration } from './pesquisa.configuration';
import { Pesquisa } from './pesquisa.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

const headers = new Headers({ 'accept': '*/*'});
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class PesquisaService2 {

    constructor(
        private _http: Http,
        private _pesquisasConfig: PesquisaConfiguration
    ) {
        Pesquisa.setPesquisaStrategy({
            retrieve: (pesquisaId: number) => this.getPesquisa(pesquisaId)
        });
    }

    getAllPesquisas(): Observable<Pesquisa[]> {
        const url = 'http://servicodados.ibge.gov.br/api/v1/pesquisas';

        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => json.filter(obj => this._pesquisasConfig.isValida(obj.id)))
            .map(json => json.map(obj => Pesquisa.criar(obj)))
            // .do(pesquisas => console.log(`getAllPesquisas`, pesquisas))
            .share();
    }

    private _getPesquisaCache = {};
    private getPesquisaKeyCache(pesquisaId: number): string {
        return `${pesquisaId}`;
    }
    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        let keyCache = this.getPesquisaKeyCache(pesquisaId);
        if(!this._getPesquisaCache[keyCache]) {
            const url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}`;

            this._getPesquisaCache[keyCache] = this._http.get(url, options)
                .retry(3)
                .catch(err => Observable.of({ json: () => ({}) }))
                .map(res => res.json())
                .filter(obj => this._pesquisasConfig.isValida(obj.id))
                .map(obj => Pesquisa.criar(obj))
                // .do(pesquisa => console.log(`get(${pesquisaId})`, pesquisa))
                .share();
        }

        return this._getPesquisaCache[keyCache];
    }
}