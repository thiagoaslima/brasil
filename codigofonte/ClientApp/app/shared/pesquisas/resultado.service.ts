import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { ServidorPesquisas, EscopoIndicadores } from './configuration/servidor.configuration';
import { PesquisasConfiguration } from './configuration/pesquisas.configuration';
import { ResultadoIndicadorServer, ResultadoLocalidadeServer } from './models/server.interfaces';
import { Resultado } from './models/resultado.model';
import { Pesquisa } from './models/pesquisa.model';
import { Indicador } from './models/indicador.model';
import { Localidade } from '../localidades/models/localidade.model';
import { ResultadoStrategy } from './strategies/resultados.strategies';

import { flat } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class ResultadoService {

    constructor(
        private _http: Http,
        private _servidor: ServidorPesquisas
    ) { 
         Indicador.setResultadoStrategy(new ResultadoStrategy(this))
    }

    getResultadoIndicador(pesquisaId: number, indicadorId: number, codigoLocalidade: string | number | number[], periodo: string | string[] = 'all') {
        const periodos = Array.isArray(periodo) ? periodo.join('|') : periodo;
        const codigos = Array.isArray(codigoLocalidade) ? codigoLocalidade.join('|') : codigoLocalidade.toString();

        return this._http.get(this._servidor.resultadosIndicador({
            pesquisaId: pesquisaId,
            indicadorId: indicadorId,
            codigoLocalidade: codigos,
            periodo: periodos
        }))
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => flat<Resultado>(json.map(item => this._convertServerObjToResultado(pesquisaId, item))))
            .map(arr => arr[0])
            .share();
    }

    getResultadosIndicadoresFilhos(indicador: Indicador, codigoLocalidade: string | number | number[], periodo: string | string[] = 'all') {
        const periodos = Array.isArray(periodo) ? periodo.join('|') : periodo;
        const codigos = Array.isArray(codigoLocalidade) ? codigoLocalidade.join('|') : codigoLocalidade.toString();

        return this._http.get(this._servidor.resultadosIndicadoresFilhos({
            pesquisaId: indicador.pesquisaId,
            codigoLocalidade: codigos,
            posicaoIndicador: indicador.posicao,
            periodo: periodos
        }))
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => flat<Resultado>(json.map(item => this._convertServerObjToResultado(indicador.pesquisaId, item))))
            .share();
    }

    getAllResultadosDaPesquisa(pesquisaId: number, codigoLocalidade: string | number | number[], escopo: EscopoIndicadores = EscopoIndicadores.arvore) {
        const codigos = Array.isArray(codigoLocalidade) ? codigoLocalidade.join('|') : codigoLocalidade.toString();

        return this._http.get(this._servidor.resultadosIndicadoresFilhos({
            pesquisaId,
            codigoLocalidade: codigos,
            posicaoIndicador: "0",
            periodo: 'all',
            escopo: EscopoIndicadores.arvore
        }))
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => flat<Resultado>(json.map(item => this._convertServerObjToResultado(pesquisaId, item))))
            .share();
    }

    _convertServerObjToResultado(pesquisaId, resultado) {
        // ResultadoIndicadorServer
        if (resultado['id']) {
            const resultadosIndicador: ResultadoIndicadorServer = resultado;
            const indicador = resultadosIndicador.id;
            return resultadosIndicador.res.map(res => {
                return new Resultado(pesquisaId, indicador, parseInt(res.localidade, 10), res.res);
            });
        }

        // ResultadoLocalidadeServer
        if (resultado['localidade']) {
            const resultadosLocalidade: ResultadoLocalidadeServer = resultado;
            const localidade = resultadosLocalidade.localidade;
            return resultadosLocalidade.res.map(res => {
                return new Resultado(pesquisaId, res.indicador, parseInt(localidade, 10), res.res);
            });
        }
    }
}