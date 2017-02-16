import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Periodo, Pesquisa, Indicador, Resultado } from './pesquisa.interface';
import { slugify } from '../../utils/slug';
import { flatTree } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/zip';

@Injectable()
export class PesquisaService {

    private _server = {
        path(str) {
            return `http://servicodados.ibge.gov.br/api/v1/${str}`;
        }
    }

    constructor(
        private _http: Http
    ) { }

    getAllPesquisas(): Observable<Pesquisa[]> {
        return this._http.get(this._server.path('pesquisas'))
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => json.map(pesquisa => new Pesquisa(pesquisa)))
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        return this.getAllPesquisas()
            .filter(res => res.length > 0)
            .map(json => json.reduce((agg, pesquisa) => pesquisa.id === pesquisaId ? pesquisa : agg, null))

    }

    getListaIndicadoresDaPesquisa(pesquisaId: number): Observable<Indicador[]> {
        return this._http.get(this._server.path(`pesquisas/${pesquisaId}/periodos/all/indicadores`))
            .retry(3)
            .catch(err => {
                return Observable.of({ json: () => [] });
            })
            .map(res => res.json())
            .zip(this.getPesquisa(pesquisaId), (json, pesquisa) => {
                return json.map(indicador => this._createIndicadoresInstance(indicador, pesquisa))
            });
    }

    getIndicadores(pesquisaId: number, indicadoresId?: number | number[]): Observable<Indicador[]> {
        
        if (!indicadoresId) {
            return this.getListaIndicadoresDaPesquisa(pesquisaId);
        }

        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        return this.getListaIndicadoresDaPesquisa(pesquisaId)
            .map(indicadores => {
                return flatTree(indicadores).filter(indicador => _indicadoresId.indexOf(indicador.id) > -1);
            });
    }

    getResultados(pesquisaId: number, localidadesCodigo: number | number[]): Observable<Indicador[]> {
        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];

        let url = this._server.path(`pesquisas/${pesquisaId}/periodos/all/resultados?localidade=${_localidadesCodigoArray.join(',')}`);

        let resultados$ = this._http.get(url).map(res => res.json());
        let indicadores$ = this.getIndicadores(pesquisaId);


        return Observable.zip(indicadores$, resultados$)
            .map(([indicadores, resultados]) => {
                let hashRes = resultados.reduce((agg, resultado) => {
                    agg[resultado.id] = resultado;
                    return agg;
                }, {});

                flatTree(indicadores).forEach(indicador => {
                    // nem todos os indicadores possuem valores
                    return hashRes[indicador.id]
                        ? indicador.saveResultados(hashRes[indicador.id].res)
                        : indicador
                });

                return indicadores;
            });
    }

    getDadosIndicadores(pesquisaId: number, localidadesCodigo: number | number[], indicadoresId?: number | number[]): Observable<Indicador[]> {
        if (!indicadoresId) {
            return this.getResultados(pesquisaId, localidadesCodigo);
        }

        let _indicadoresIdArray = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        return this.getResultados(pesquisaId, localidadesCodigo)
            .map(indicadores => {
                return flatTree(indicadores).filter(indicador => _indicadoresIdArray.indexOf(indicador.id) > -1);
            });
    }

    /**
     * Obtém o histórico de um munucípio, dado seu código.
     * 
     */
    public getHistorico(codigoLocalidade: number) {

        debugger;

        let codigo: string = codigoLocalidade.toString().substr(0, 6);

        return this._http.get(`http://servicodados.ibge.gov.br/api/v1/biblioteca?aspas=3&codmun=${codigo}`)
            .map((res) => {

                return res.json();
            })
            .map((res) => {

                let key = Object.keys(res).find((key) => {
                    return key.indexOf(codigo) == 0;
                });

                return res[key];
            })
            .map((res) => {

                debugger;

                return {

                    historico: res && res.HISTORICO,
                    fonte: res && res.HISTORICO_FONTE,
                    formacaoAdministrativa: res && res.FORMACAO_ADMINISTRATIVA
                }
            });
    }



    private _createIndicadoresInstance(protoIndicador, pesquisa, parentId = 0) {
        let children = [];

        if (protoIndicador.children.length) {
            children = protoIndicador.children.map(child => this._createIndicadoresInstance(child, pesquisa, protoIndicador.id));
        }

        return new Indicador(Object.assign(
            {},
            protoIndicador,
            {
                children,
                pesquisa,
                parentId
            }
        ))
    }

}

