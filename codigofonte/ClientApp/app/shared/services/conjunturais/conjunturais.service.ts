import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { ConjunturalDTO } from '.';
import { Resultado, Indicador } from '..';
import { LocalidadeService3 } from '..';
import { converterObjArrayEmHash } from '../../../../utils';
import { ConfigService } from '../../config';

import { Observable } from 'rxjs/Observable';
import { ENDPOINT } from "../../";


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class ConjunturaisService {

    constructor(
        private _http: Http,
        private _localidadeService: LocalidadeService3,
        private configService: ConfigService
    ) { }

    getIndicador(pesquisaId: number, indicadorId: number, qtdePeriodos = 100, categoria?: string): Observable<ConjunturalDTO[]> {

        const params = categoria ? `?categoria=${categoria}` : '';
        const url = this.setUrl(`conjunturais/${pesquisaId}/periodos/-${qtdePeriodos}/indicadores/${indicadorId}${params}`, ENDPOINT.SERVICO_DADOS_CONJUNTURAIS, 2);
        return this._request(url).map(arr => arr.map(obj => this._removeDotFromPropertyName(obj))).catch(err => this._handleError(err));
    }

    getIndicadorAsResultado(pesquisaId: number, indicadorId: number, qtdePeriodos = 100, categoria?: string): Observable<Resultado[]> {

        return this.getIndicador(pesquisaId, indicadorId, qtdePeriodos, categoria)
            .map(array => this._convertConjunturalIntoResultado(pesquisaId, array));
    }

    private _removeDotFromPropertyName(object: ConjunturalDTO): ConjunturalDTO {
        const o = {} as ConjunturalDTO;
        for (let property in object) {
            if (object.hasOwnProperty(property)) {
                let prop = property.replace('.', '');
                o[prop] = object[property];
            }
        }
        return o;
    }
    private _getPropriedadesEspecificasResultado(object: Object): string[] {

        let propriedadesGerais = ['p', 'p_cod', 'ug', 'ug_cod', 'um', 'um_cod', 'v', 'var', 'var_cod'];
        let propriedadesEspecificas = [];

        for (let property in object) {

            if (object.hasOwnProperty(property)) {

                if (propriedadesGerais.indexOf(property) === -1) {

                    propriedadesEspecificas.push(property);
                }
            }
        }

        return propriedadesEspecificas;
    }

    private _convertConjunturalIntoResultado(pesquisaId: number, conjunturais: ConjunturalDTO[] = []): Resultado[] {

        if (conjunturais.length === 0) { return []; }

        const brasil = this._localidadeService.getRoot();

        let propriedadesEspecificas = this._getPropriedadesEspecificasResultado(conjunturais[0]);

        let codigoPropriedadeEspecifica;
        let nomePropriedadeEspecifica;

        if(!propriedadesEspecificas || propriedadesEspecificas.length == 0){

            codigoPropriedadeEspecifica = 'var_cod';
            nomePropriedadeEspecifica = 'var';

        } else {

            codigoPropriedadeEspecifica = propriedadesEspecificas[0].indexOf('_cod') >= 0 ? propriedadesEspecificas[0] : propriedadesEspecificas[1];
            nomePropriedadeEspecifica = propriedadesEspecificas[0].indexOf('_cod') == -1 ? propriedadesEspecificas[0] : propriedadesEspecificas[1];
        }


        const conjunturaisKeyValue: { [cod: string]: ConjunturalDTO[] } = converterObjArrayEmHash(conjunturais, codigoPropriedadeEspecifica, true);


        return Object.keys(conjunturaisKeyValue)
            .map(key => {
                const itens = conjunturaisKeyValue[key];

                const conjuntural = itens[0];
                const posicao = conjuntural[nomePropriedadeEspecifica] &&
                    conjuntural[nomePropriedadeEspecifica].indexOf('. ') >= 0
                    ? conjuntural[nomePropriedadeEspecifica].split('. ')[0] : '0';

                const indicadorParams = {
                    id: parseInt(conjuntural.var_cod, 10),
                    indicador: conjuntural.var,
                    posicao: posicao,
                    classe: null,
                    children: [],
                    pesquisa_id: pesquisaId,
                    nota: [],
                    fonte: [],
                    unidade: {
                        id: conjuntural.um,
                        classe: '',
                        multiplicador: 1
                    }
                };

                const indicador = Indicador.criar(indicadorParams);

                const res = itens.reduce((agg, item) => {
                    agg[item.p] = item.v;
                    return agg;
                }, {});

                const periodos = itens.sort((a, b) => {
                    return a.p_cod > b.p_cod ? -1 : 1;
                }).map(item => item.p);


                const resultadoParams = {
                    id: parseInt(conjuntural.var_cod, 10),
                    codigoLocalidade: '0',
                    res: res,
                    indicador: indicador,
                    localidade: brasil,
                    periodos: periodos
                };

                return Resultado.criar(resultadoParams);
            });

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

                return res.json();
            })
            .share();
    }

    private _handleError(error: Error, customError?: Error): Observable<any> {
        return Observable.throw(error.message ? error : customError);
    }

    private setUrl(path, endpoint = ENDPOINT.SERVICO_DADOS, version = 1) {

        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }
        return `${this.configService.getConfigurationValue(endpoint)}/v${version}/${path}`;
    }

}
