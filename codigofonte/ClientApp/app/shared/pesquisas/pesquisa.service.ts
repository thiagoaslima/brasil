import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { ServidorPesquisas, EscopoIndicadores } from './configuration/servidor.configuration';
import { PesquisasConfiguration } from './configuration/pesquisas.configuration';
import { Pesquisa } from './models/pesquisa.model';
import { Indicador } from './models/indicador.model';
import { PesquisaStrategy } from './strategies/pesquisa.strategies';
import { IndicadoresFilhosStrategy, IndicadorPaiStrategy } from './strategies/indicador.strategies';
import { flatTree } from '../../utils/flatFunctions';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

const headers = new Headers({ 'accept': '*/*'});
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class PesquisaService {

    constructor(
        private _http: Http,
        private _servidor: ServidorPesquisas,
        private _pesquisasConfig: PesquisasConfiguration
    ) {
        Pesquisa.setStrategy(new IndicadoresFilhosStrategy(this));
        
        Indicador.setPesquisaStrategy(new PesquisaStrategy(this));
        Indicador.setIndicadorPaiStrategy(new IndicadorPaiStrategy(this));
        Indicador.setIndicadoresFilhoStrategy(new IndicadoresFilhosStrategy(this));
    }
 
    getAllPesquisas(): Observable<Pesquisa[]> {
        return this._http.get(this._servidor.pesquisas(), options)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => json.filter(pesquisa => this._pesquisasConfig.isValida(pesquisa.id)))
            .map(json => json.map(pesquisa => new Pesquisa(pesquisa)))
            .do(pesquisas => console.log(`getAllPesquisas`, pesquisas))
            .share();
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        return this._http.get(this._servidor.pesquisa(pesquisaId), options)
            .retry(3)
            .catch(err => Observable.of({ json: () => ({}) }))
            .map(res => res.json())
            .filter(obj => this._pesquisasConfig.isValida(obj.id))
            .map(obj => new Pesquisa(obj))
            .do(pesquisa => console.log(`getPesquisa(${pesquisaId})`, pesquisa))
            .share();
    }

    getIndicadorByPosicao(pesquisaId: number, posicaoIndicador, codigoLocalidade?): Observable<Indicador> {
        return this._http.get(this._servidor.indicadorByPosicao(pesquisaId, posicaoIndicador, codigoLocalidade))
            .retry(3)
            .catch(err => Observable.of({ json: () => ({}) }))
            .map(res => res.json())
            .map(obj => new Indicador(Object.assign(obj, {pesquisaId})))
            .do(indicador => console.log(`getIndicadorByPosicao`, indicador))
            .share();
    }

    getIndicadoresFilhos(pesquisaId: number, posicaoIndicador = '0', codigoLocalidade?): Observable<Indicador[]> {
        return this._http.get(this._servidor.indicadoresFilhos(pesquisaId, posicaoIndicador, codigoLocalidade), options)
            .retry(3)    
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => json.map(obj => new Indicador(Object.assign({pesquisaId}, obj))))
            .do(indicadores => console.log(`getIndicadoresFilhos`, indicadores))
            .share();
    }

    getIndicadoresComResultados(pesquisaId: number, posicaoIndicador = '0', codigoLocalidade: number|number[]|string, escopo = EscopoIndicadores.filhos): Observable<Indicador[]> {
        const localidade = Array.isArray(codigoLocalidade) ? codigoLocalidade.join(',') : codigoLocalidade;
        return this._http.get(this._servidor.indicadoresFilhos(pesquisaId, posicaoIndicador, localidade, escopo), options)
            .retry(3)    
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(flatTree)
            .map(array => array.map(obj => new Indicador(Object.assign({res: [], pesquisaId}, obj))))
            .do(indicadores => console.log(`getIndicadoresComResultados`, indicadores))
            .share();
    }

}