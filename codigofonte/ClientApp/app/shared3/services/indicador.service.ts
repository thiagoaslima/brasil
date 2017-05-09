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

    getIndicadoresDaPesquisa(pesquisaId: number, { arvoreCompleta = false, localidades = [] as Array<number | string> } = {}): Observable<Indicador[]> {
        return this.getIndicadoresFilhosByPosicao(pesquisaId, '0', { arvoreCompleta, localidades })
            .catch(err => this._handleError(err));
    }

    getIndicadoresFilhosByPosicao(pesquisaId: number, posicao: string, { arvoreCompleta = false, localidades = [] as Array<number | string> } = {}): Observable<Indicador[]> {
        const escopo = arvoreCompleta ? escopoIndicadores.arvoreCompleta : escopoIndicadores.filhos;
        const url = servidor.setUrl(`pesquisas/${pesquisaId}/periodos/all/indicadores/0?scope=${escopo}&localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: ${escopo}]`;

        return this._request(url)
            .map(arr => arr.map(obj => Indicador.criar(Object.assign(obj, { pesquisa_id: pesquisaId }))))
            .catch(err => this._handleError(err, new Error(errorMessage)))
    }
    getIndicadoresFilhosComPesquisaByPosicao(pesquisaId: number, posicao: string, { arvoreCompleta = false, localidades = [] as Array<number | string> } = {}): Observable<Indicador[]> {
        const escopo = arvoreCompleta ? escopoIndicadores.arvoreCompleta : escopoIndicadores.filhos;
        const url = servidor.setUrl(`pesquisas/${pesquisaId}/periodos/all/indicadores/0?scope=${escopo}&localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: ${escopo}]`;

        return Observable.zip(this._request(url), this._pesquisaService.getPesquisa(pesquisaId))
            .map(([arr, pesquisa]) => arr.map(obj => Indicador.criar(Object.assign(obj, { pesquisa: pesquisa }))))
            .catch(err => this._handleError(err, new Error(errorMessage)))
    }

    getIndicadoresById(indicadoresId: number[], localidades = [] as Array<number | string>): Observable<Indicador[]> {
        const url = servidor.setUrl(`pesquisas/indicadores/${indicadoresId.join('|')}?localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível retornar indicadores para os parâmetros informados. [id: ${indicadoresId.join(', ') || 'nenhum valor informado'}]`

        return this._request(url)
            .map(array => array.map(Indicador.criar))
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }

    getIndicadoresComPesquisaById(indicadoresId: number[], localidades = [] as Array<number | string>): Observable<Indicador[]> {
        const url = servidor.setUrl(`pesquisas/indicadores/${indicadoresId.join('|')}?localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível retornar indicadores para os parâmetros informados. [id: ${indicadoresId.join(', ') || 'nenhum valor informado'}}]`

        return this._request(url)
            .mergeMap(responseIndicadores => {
                const pesquisasId = arrayUniqueValues(responseIndicadores.map(obj => obj.pesquisa_id));
                return this._pesquisaService.getPesquisas(pesquisasId).map(pesquisas => [responseIndicadores, pesquisas]);
            })
            .map(([responseIndicadores, pesquisas]) => {
                const hashPesquisas = converterObjArrayEmHash(pesquisas, 'id');
                return responseIndicadores.map(obj => Indicador.criar(Object.assign(obj, { pesquisa: hashPesquisas[obj.pesquisa_id] })))
            })
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
        return Object.keys(res).length === 1 && Object.prototype.hasOwnProperty.apply(res, 'message');
    }

}
