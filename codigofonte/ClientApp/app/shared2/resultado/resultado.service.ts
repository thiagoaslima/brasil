import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Resultado } from './resultado.model';
import { Indicador, EscopoIndicadores } from '../indicador/indicador.model';
import { Localidade } from '../localidade/localidade.model';

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
export class ResultadoService2 {

    constructor(
        private _http: Http
    ) { 
        Resultado.setResultadoStrategy({
            retrieve: this.getResultados.bind(this)
        }) 
    }

    getResultados(pesquisaId: number, posicaoIndicador: string, codigoLocalidade: string, escopo = EscopoIndicadores.proprio): Observable<Resultado[]> {
        const url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${posicaoIndicador}/resultados/${codigoLocalidade}?scope=${escopo}`;

        return this._http.get(url, options)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(array => {
                array = Resultado.converterGroupedByIndicador(array);
                return array.map(obj => Resultado.criar(obj))
            })
            // .do(resultados => console.log(`getResultado`, resultados))
            .share();
    }
}
