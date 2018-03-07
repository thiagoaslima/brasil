import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { converterObjArrayEmHash } from '../../../../utils';
import { PesquisaDTO } from '.';
import { Indicador, Pesquisa } from '..';
import { escopoIndicadores, listaNiveisTerritoriais, ServicoDados as servidor } from '../values';
import { CacheFactory } from '../../cache/cacheFactory.service';
import { RxSimpleCache } from '../../cache/decorators';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });
import {TraducaoService}  from '../../traducao/traducao.service';

@Injectable()
export class PesquisaService3 {

    static readonly cache = CacheFactory.createCache('pesquisaCache', 10);
    idioma:string;

    /**
     * Em algumas pesquisas os indicadores podem ser diferentes de um ano para outro, 
     * neste caso, deve-se sempre obter os indicadores para cada ano informado, ao 
     * invés de utilizar o período como all.
     * Cadastre o código destas pesquisas no array abaixo para que a tabela de pesquisa
     * envie o período pesquisado ao solicitar os indicadores da pesquisa.
     * 
     *  1 - PESQUISA MUNIC
     * 45 - PESQUISA SÍNTESE DE INDICADORES SOCIAIS
     */
    private PESQUISAS_COM_INDICADORES_QUE_VARIAM_COM_ANO: number[] = [ 1, 45, 10072 ];

    constructor(
        private _http: Http,
        private _traducaoService:TraducaoService,
    ) { 

        if(this._traducaoService.lang!=null){
            this.idioma = this._traducaoService.lang;
        }else{
            this.idioma = 'PT';
        }
    }

    @RxSimpleCache({
        cache: PesquisaService3.cache
    })
    getAllPesquisas(): Observable<Pesquisa[]> {
        const url = servidor.setUrl('pesquisas');
        const errorMessage = `Não foi possível recuperar as pesquisas`;
        
        return this._request(url)
            .map(arr => arr.map(Pesquisa.criar))
            .map(pesquisas => pesquisas.sort((a, b) => a.nome < b.nome ? -1 : 1))
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }
    @RxSimpleCache({
        cache: PesquisaService3.cache
    })
    getPesquisasPorAbrangenciaTerritorial(nivelTerritorial: string): Observable<Pesquisa[]> {
        if (Pesquisa.niveisTerritoriaisPossiveis.indexOf(nivelTerritorial) === -1) {
            const errorMessage = `Não existe o nível territorial pesquisado. Favor verifique sua solicitação. [nivelterritorial: ${nivelTerritorial}]`;
            return this._handleError(new Error(errorMessage));
        }

        return this.getAllPesquisas()
            .map(pesquisas => {
                return pesquisas.filter(pesquisa => pesquisa.abrangeNivelTerritorial(nivelTerritorial))
            })
            .catch(err => {
                return this._handleError(err)
            });
    }

    @RxSimpleCache({
        cache: PesquisaService3.cache
    })
    getPesquisas(pesquisasId: number[]): Observable<Pesquisa[]> {
        return this.getAllPesquisas()
            .map(pesquisas => {
                const hashPesquisasById = converterObjArrayEmHash(pesquisas, 'id');
                return this._filterPesquisas(hashPesquisasById, pesquisasId);
            })
            .catch(err => this._handleError(err));
    }

    @RxSimpleCache({
        cache: PesquisaService3.cache
    })
    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        const url = servidor.setUrl(`pesquisas/${pesquisaId}`);
        const errorMessage = `Não foi possível recuperar a pesquisa solicitada. Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]`;
        
        return this._request(url)
            .map(Pesquisa.criar)
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }

    public isPesquisaComIndicadoresQueVariamComAno(idPesquisa: number){

        return this.PESQUISAS_COM_INDICADORES_QUE_VARIAM_COM_ANO.indexOf(idPesquisa) >= 0;
    }

    private _request(url: string): Observable<any> {

        if(this.idioma!=null){
            if(url.indexOf('?')>0){

                 url+='&lang='+this.idioma;
            }else{

                 url+='?lang='+this.idioma;
            }
        }
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

                return obj;
            });
    }

    private _handleError(error: Error, customError?: Error): Observable<any> {
        return Observable.throw(error.message ? error : customError);
    }

    private _filterPesquisas(hash, pesquisasId) {
        const obj = pesquisasId.reduce((acc, id) => {
            if (hash[id]) {
                acc.pesquisas.push(hash[id]);
            } else {
                acc.errors.push(id);
            }
            return acc;
        }, { pesquisas: [] as Pesquisa[], errors: [] as number[] });

        if (obj.errors.length > 0) {
            throw new Error(`Não foram encontradas todas as pesquisas solicitadas. [ids: ${obj.errors.join(', ')}]`)
        }

        return obj.pesquisas;
    }

}