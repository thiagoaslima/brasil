import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaConfiguration } from './pesquisa.configuration';
import { Pesquisa } from './pesquisa.model';
import { slugify } from '../../utils/slug';

import {TraducaoService} from '../../traducao/traducao.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class PesquisaService2 {

    idioma:string;
    constructor(
        private _http: Http,
        private _pesquisasConfig: PesquisaConfiguration,
        private _traducaoService:TraducaoService
    ) {
        Pesquisa.setPesquisaStrategy({
            retrieve: (pesquisaId: number) => this.getPesquisa(pesquisaId)
        });
        this.idioma = this._traducaoService.lang;
     
    }

    private _allPesquisasCache: Array<Pesquisa>;
    getAllPesquisas(): Observable<Pesquisa[]> {
        const url = 'https://servicodados.ibge.gov.br/api/v1/pesquisas/?lang='+this.idioma;

        if (this._allPesquisasCache) {
            return Observable.of(this._allPesquisasCache);
        }

        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => json.filter(obj => this._pesquisasConfig.isValida(obj.id)))
            .map(json => json.map(obj => Pesquisa.criar(obj)))
            .map(pesquisas => pesquisas.sort((a, b) => slugify(a.nome) < slugify(b.nome) ? -1 : 1))
            .do(pesquisas => this._allPesquisasCache = pesquisas)
            .share();
    }

    private _byTipoCache = {};
    getAllPesquisasPorTipoLocalidade(tipoLocalidade: string) {
        if (this._byTipoCache[tipoLocalidade]) {
            return Observable.of(this._byTipoCache[tipoLocalidade]);
        }
        return this.getAllPesquisas()
            .map(pesquisas => pesquisas.filter(pesquisa => pesquisa.contexto[tipoLocalidade]))
            .map(pesquisas => {
                const pesquisasComDados = this._pesquisasConfig.comDados(tipoLocalidade).reduce( (agg, num) => {
                    agg[num] = true;
                    return agg;
                }, {});

                return pesquisas.filter(pesquisa => pesquisasComDados[pesquisa.id]);
            })
            .do(pesquisas => this._byTipoCache[tipoLocalidade] = pesquisas);
    }

    private _getPesquisaCache = {};
    private getPesquisaKeyCache(pesquisaId: number): string {
        return `${pesquisaId}`;
    }
    getPesquisa(pesquisaId: number): Observable<Pesquisa> {

        let keyCache = this.getPesquisaKeyCache(pesquisaId);
        if (!this._getPesquisaCache[keyCache]) {
            const url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}?lang=`+this.idioma;

            this._getPesquisaCache[keyCache] = this._http.get(url, options)
                .retry(3)
                .catch(err => Observable.of({ json: () => ({}) }))
                .map(res => res.json())
                // .filter(obj => this._pesquisasConfig.isValida(obj.id))
                .map(obj => Pesquisa.criar(obj))
                .do(pesquisa => this._getPesquisaCache[keyCache] = Observable.of(pesquisa))
                // .do(pesquisa => console.log(`get(${pesquisaId})`, pesquisa))
                .share();
        }

        return this._getPesquisaCache[keyCache];
    }
}