import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { ResultadoDTO } from "../dto";
import { Indicador, Localidade, Resultado } from '../models';
import { ServicoDados as servidor, niveisTerritoriais } from '../values';
import { IndicadorService3, LocalidadeService3 } from ".";
import { forceArray } from '../../utils2';
import { CacheFactory } from "../../cache/cacheFactory.service";
import { RxSimpleCache } from "../../cache/decorators";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });
@Injectable()
export class ResultadoService3 {
    static readonly cache = CacheFactory.createCache('resultadosService', 10);

    constructor(
        private _http: Http,
        private _indicadorService: IndicadorService3,
        private _localidadeService: LocalidadeService3
    ) { }

    @RxSimpleCache({
        cache: ResultadoService3.cache
    })
    getResultados(indicadoresId: number | number[], codigolocalidades: number | number[]) {
        const _indicadores = forceArray(indicadoresId);
        const _localidades = forceArray(codigolocalidades);
        const url = servidor.setUrl(`pesquisas/indicadores/${_indicadores.join('|')}/resultados/${_localidades.join('|')}`);
        const errorMessage = `Não foi possível recuperar os resultados solicitados. [indicadores: ${_indicadores.join(', ')}, localidades: ${_localidades.join(', ')}]`

        return this._request(url)
            .map(json => Resultado.convertDTOintoParameters(json).map(Resultado.criar))
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }

    @RxSimpleCache({
        cache: ResultadoService3.cache
    })
    getResultadosCartograma(indicadorId: number, codigoLocalidade: number) {

        let requisicaoLocalidade: string;

        switch (codigoLocalidade.toString().length) {
            case 1:
                requisicaoLocalidade = 'xx';
                break;
            case 2:
                requisicaoLocalidade = `${codigoLocalidade}xxxx`;
                break;
        }

        const url = servidor.setUrl(`pesquisas/indicadores/${indicadorId}/resultados/${requisicaoLocalidade}`);
        const errorMessage = `Não foi possível recuperar os resultados solicitados. [indicador: ${indicadorId}, localidade: ${codigoLocalidade}]`

        return this._request(url)
            .map(json => {
                return Resultado.convertDTOintoParameters(json)
                    .map(Resultado.criar)
                    .reduce((acc, resultado) => {
                        acc[resultado.codigoLocalidade] = resultado;
                        return acc;
                    }, {});
            })
            .catch(err => this._handleError(err, new Error(errorMessage)));
    }

    @RxSimpleCache({
        cache: ResultadoService3.cache
    })
    getResultadosCompletos(indicadoresId: number | number[], codigolocalidades: number | number[]) {
        const _indicadoresId = forceArray(indicadoresId);
        const _codigoLocalidades = forceArray(codigolocalidades).filter(Boolean);

        const url = servidor.setUrl(`pesquisas/indicadores/${_indicadoresId.join('|')}/resultados/${_codigoLocalidades.join('|')}`);
        const errorMessage = `Não foi possível recuperar os resultados solicitados. [indicadores: ${_indicadoresId.join(', ')}, localidades: ${_codigoLocalidades.join(', ')}]`

        return Observable.zip(
            this._request(url),
            this._indicadorService.getIndicadoresComPesquisaById(_indicadoresId),
            Observable.of(this._localidadeService.getLocalidadesByCodigo(_codigoLocalidades))
        )
            .map(([json, indicadores, localidades]: [ResultadoDTO, Indicador[], Localidade[]]) => {
                return Resultado.convertDTOintoParameters(json).map(parameter => {
                    const indicador = indicadores.find(_indicador => _indicador.id === parameter.id);
                    const localidade = localidades.find(_localidade => _localidade.codigo === parameter.localidade);
                    return Resultado.criar(Object.assign({}, parameter, { indicador, localidade }));
                })
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
        return res && typeof res === 'object' && !Array.isArray(res) && Object.prototype.hasOwnProperty.apply(res, 'message') && Object.keys(res).length === 1;
    }
}