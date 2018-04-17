import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { PesquisaService3, Pesquisa } from '..';
import { Indicador } from '.';
import { CacheFactory } from '../../cache/cacheFactory.service';
import { RxSimpleCache } from '../../cache/decorators';
import { escopoIndicadores } from '../values';
import { ConfigService } from '../../config';
import { arrayUniqueValues, converterObjArrayEmHash, curry, getProperty } from '../../../../utils';
import {TraducaoService}  from '../../traducao/traducao.service';
import { ModalErrorService } from '../../../core';
import { ENDPOINT } from "../../";

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
    static readonly cache = CacheFactory.createCache('indicadoresService', 10);
    idioma:string;

    constructor(
        private _http: Http,
        private _pesquisaService: PesquisaService3,
        private _traducaoService:TraducaoService,
        private modalErrorService: ModalErrorService,
        private configService: ConfigService
    ) { 
        if(this._traducaoService.lang!=null){
            this.idioma = this._traducaoService.lang;
        }else{
            this.idioma = 'PT';
        }
       
    }

    @RxSimpleCache({
        cache: IndicadorService3.cache
    })
    getIndicadoresDaPesquisaByPeriodo(pesquisaId: number, periodo: string = 'all', { arvoreCompleta = false, localidades = [] as Array<number | string> } = {}): Observable<Indicador[]> {

        return this.getIndicadoresFilhosByPosicao(pesquisaId, '0', periodo, { arvoreCompleta, localidades })
            .catch(err => this._handleError(err));
    }

    @RxSimpleCache({
        cache: IndicadorService3.cache
    })
    getIndicadoresDaPesquisa(pesquisaId: number, { arvoreCompleta = false, localidades = [] as Array<number | string> } = {}): Observable<Indicador[]> {
        return this.getIndicadoresFilhosByPosicao(pesquisaId, '0', 'all', { arvoreCompleta, localidades })
            .catch(err => this._handleError(err));
    }

    @RxSimpleCache({
        cache: IndicadorService3.cache
    })
    getIndicadoresFilhosByPosicao(pesquisaId: number, posicao="0", periodo="all", { arvoreCompleta = false, localidades = [] as Array<number | string> } = {}): Observable<Indicador[]> {
        const escopo = arvoreCompleta ? escopoIndicadores.arvoreCompleta : escopoIndicadores.filhos;
        const url = this.setUrl(`pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${posicao}?scope=${escopo}&localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: ${escopo}]`;

        return this._request(url)
            .map(arr => arr.map(obj => {

                obj['pesquisa_id'] = pesquisaId;

                return Indicador.criar(obj);
            }
            ))
            .catch(err => this._handleError(err, new Error(errorMessage)))
    }

    @RxSimpleCache({
        cache: IndicadorService3.cache
    })
    getIndicadoresFilhosComPesquisaByPosicao(pesquisaId: number, posicao="0", periodo="all", { arvoreCompleta = false, localidades = [] as Array<number | string> } = {}): Observable<Indicador[]> {
        const escopo = arvoreCompleta ? escopoIndicadores.arvoreCompleta : escopoIndicadores.filhos;
        const url = this.setUrl(`pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${posicao}?scope=${escopo}&localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: ${escopo}]`;

        return Observable.zip(this._request(url), this._pesquisaService.getPesquisa(pesquisaId))
            .map(([arr, pesquisa]) => arr.map(obj => Indicador.criar(Object.assign(obj, { pesquisa: pesquisa }))))
            .catch(err => this._handleError(err, new Error(errorMessage)))
    }

    @RxSimpleCache({
        cache: IndicadorService3.cache
    })
    getIndicadoresById(indicadoresId: number[], localidades = [] as Array<number | string>): Observable<Indicador[]> {
        const url = this.setUrl(`pesquisas/indicadores/${indicadoresId.join('|')}?localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível retornar indicadores para os parâmetros informados. [id: ${indicadoresId.join(', ') || 'nenhum valor informado'}]`

        return this._request(url)
            .map(array => array.map(Indicador.criar))
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }
    

    @RxSimpleCache({
        cache: IndicadorService3.cache
    })
    getIndicadoresByIdByLocalidade(pesquisaId: number, indicadorId: number | number[], escopo: string, localidade?, fontesNotas = false, periodo: string = 'all'): Observable<Indicador[]> {

        periodo = !periodo ? 'all' : periodo;

        const ids = Array.isArray(indicadorId) ? indicadorId.join('|') : indicadorId.toString();
        const queryLocalidade = localidade === undefined || null ? '' : `&localidade=${Array.isArray(localidade) ? localidade.join(',') : localidade}`;
        
        let url = this.setUrl(`pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${ids}?scope=${escopo}${queryLocalidade}&lang=${this.idioma}`);
        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => ({}) }))
            .map(res => res.json())
            //.map(json => flatTree(json))
            .map(array => {
                return array.map(obj => {
                    return Indicador.criar(Indicador.converter(Object.assign(obj, { pesquisa_id: pesquisaId })))
                })
            })
            //.map(array => this._rebuildTree(array))
            .do(indicadores => {
                //adiciona fonte e notas, da pesquisa nos indicadores
                if (fontesNotas && indicadores.length > 0) {
                    indicadores[0].pesquisa.subscribe((pesquisa) => {
                        //organiza os períodos da pesquisa em ordem crescente
                        pesquisa.periodos.sort((a, b) => a.nome > b.nome ? 1 : -1);
                        //pega fontes e notas do período mais recente
                        let fontes = pesquisa.periodos.length ? pesquisa.periodos[pesquisa.periodos.length - 1].fontes : null;
                        let notas = pesquisa.periodos.length ? pesquisa.periodos[pesquisa.periodos.length - 1].notas : null;
                        for (let i = 0; i < indicadores.length; i++) {
                            indicadores[i].fontes = fontes;
                            indicadores[i].notas = notas;
                        }
                    }, 
                    error => {
                        console.error(error);
                        this.modalErrorService.showError();
                    });
                }
                // console.log(`getIndicadorById`, indicadores);
            })
            .share();
    }


    @RxSimpleCache({
        cache: IndicadorService3.cache
    })
    getIndicadoresComPesquisaById(indicadoresId: number[], localidades = [] as Array<number | string>): Observable<Indicador[]> {
        const url = this.setUrl(`pesquisas/indicadores/${indicadoresId.join('|')}?localidade=${localidades.join(',')}`);
        const errorMessage = `Não foi possível retornar indicadores para os parâmetros informados. [id: ${indicadoresId.join(', ') || 'nenhum valor informado'}}]`

        return this._request(url)
            .mergeMap(responseIndicadores => {
                const pesquisasId = arrayUniqueValues(responseIndicadores.map(curry(getProperty, 'pesquisa_id')));
                return this._pesquisaService.getPesquisas(pesquisasId).map(pesquisas => [responseIndicadores, pesquisas]);
            })
            .map(([responseIndicadores, pesquisas]) => {

                const hashPesquisas = converterObjArrayEmHash(pesquisas, 'id');
               
                return responseIndicadores.map(obj => Indicador.criar(Object.assign(obj, { pesquisa: hashPesquisas[obj.pesquisa_id] })))
            })
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }


    private _request(url: string) {
        
       
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
                if (!Array.isArray(obj) && this._isServerError(obj)) {
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

    private setUrl(path, endpoint = ENDPOINT.SERVICO_DADOS, version = 1) {

        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }
        return `${this.configService.getConfigurationValue(endpoint)}/v${version}/${path}`;
    }

}
