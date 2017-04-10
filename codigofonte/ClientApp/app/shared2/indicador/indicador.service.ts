import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Indicador, EscopoIndicadores, Metadado, UnidadeIndicador } from './indicador.model';
import { flatTree } from '../../utils/flatFunctions';

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
export class IndicadorService2 {

    constructor(
        private _http: Http
    ) {
        Indicador.setIndicadoresStrategy({
            retrieve: this.getIndicadoresByPosicao.bind(this)
        })
    }

    private _prefetchMode = {
        active: false,
        localidades: []
    }
    prefetchResultados(active = true, localidades: number | string | Array<number>) {
        console.log('deprecated: do not use prefetchResultados. This function caused side-effects');
        return;
        // this._prefetchMode.active = active;
        // this._prefetchMode.localidades = Array.isArray(localidades) ? localidades : [localidades];
    }

    getIndicadoresByPosicao(pesquisaId: number, posicao: string, escopo: string): Observable<Indicador[]> {
        let url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${posicao}?scope=${escopo}`;
        
        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => ({}) }))
            .map(res => res.json())
            .map(json => flatTree(json))
            .map(array => array.map(obj => Indicador.criar(Indicador.converter(Object.assign(obj, { pesquisaId })))))
            .map(array => this._rebuildTree(array))
            .do(indicador => console.log(`getIndicadoresByPosicao`, indicador))
            .share();
    }

    getIndicadoresById(pesquisaId: number, indicadorId: number | number[], escopo: string, localidade?): Observable<Indicador[]> {
        const ids = Array.isArray(indicadorId) ? indicadorId.join('|') : indicadorId.toString();
        const queryLocalidade = localidade === undefined ? '' : `&localidade=${Array.isArray(localidade) ? localidade.join(',') : localidade}`; 
        let url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${ids}?scope=${escopo}${queryLocalidade}`;
        
        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => ({}) }))
            .map(res => res.json())
            .map(json => flatTree(json))
            .map(array => array.map(obj => Indicador.criar(Indicador.converter(Object.assign(obj, { pesquisaId })))))
            .map(array => this._rebuildTree(array))
            .do(indicador => console.log(`getIndicadorById`, indicador))
            .share();
    }

    getPosicaoRelativa(pesquisaId: number, indicadorId: number, periodo: string, codigoLocalidade: number,  contexto = 'BR') {
        let url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${indicadorId}/ranking?orderBy=&contexto=${contexto}&localidade=${codigoLocalidade}&lower=0&upper=0`;
        
        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => [{res: []}] }))
            .map(res => res.json())
            .map(arr => {
                const res = arr[0].res[0]
                res.posicaoAbsoluta = res['#'];
                delete(res['#']);
                return res;
            })
            // .map( ([{res}]) => {
            //     const obj = res.find(obj => obj.localidade === codigoLocalidade.toString());
            //     return Object.assign({}, obj, {totalItens: res.length});
            // })
            .do(indicador => console.log(`getRanking`, indicador))
            // .share();
    }

    private _rebuildTree(indicadores: Indicador[]): Indicador[] {
        let arr = [] as Indicador[];

        const hash: Indicador[] = indicadores.reduce((hash, item) => Object.assign(hash, { [item.posicao]: item }), Object.create(null))
        const keys = Object.keys(hash).sort();
        const minLen = Math.min(...keys.map(key => key.toString().split('.').length));
        const children = Object.keys(hash).sort().reduce((agg, key) => {
            const _key = key.toString().split('.');

            if (_key.length === minLen) {
                arr.push(hash[key]);
                return agg;
            }

            const parentKey = _key.slice(0, -1).join('.');
            if (!agg[parentKey]) { agg[parentKey] = []; }
            agg[parentKey].push(hash[key]);
            return agg;
            
        }, Object.create(null));

        return arr;
    }
}