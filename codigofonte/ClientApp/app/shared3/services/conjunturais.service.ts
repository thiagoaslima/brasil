import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { ConjunturalDTO } from '../dto';
import { Resultado, Indicador } from '../models';
import { LocalidadeService3 } from '.';
import { ServicoDados as servidor } from '../values';
import { converterObjArrayEmHash } from '../../utils2';

import { Observable } from 'rxjs/Observable';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class ConjunturaisService {

    constructor(
        private _http: Http,
        private _localidadeService: LocalidadeService3
    ) { }

    getIndicador(pesquisaId: number, indicadorId: number, qtdePeriodos = 100, categoria?: string): Observable<ConjunturalDTO[]> {
        const params = categoria ? `?categoria=${categoria}` : '';
        const url = servidor.setUrl(`conjunturais/${pesquisaId}/periodos/-${qtdePeriodos}/indicadores/${indicadorId}${params}`, 2);
        return this._request(url).catch(err => this._handleError(err));
    }

    getIndicadorAsResultado(pesquisaId: number, indicadorId: number, qtdePeriodos = 100, categoria?: string): Observable<Resultado[]> {
        return this.getIndicador(pesquisaId, indicadorId, qtdePeriodos, categoria)
            .map(array => this._convertConjunturalIntoResultado(pesquisaId, array));
    }

    private _convertConjunturalIntoResultado(pesquisaId: number, conjunturais: ConjunturalDTO[] = []): Resultado[] {
        if (conjunturais.length === 0) { return []; }

        const brasil = this._localidadeService.getRoot();

        debugger;

        const conjunturaisKeyValue: {[cod: string]: ConjunturalDTO[]} =
            conjunturais[0].geral_grupo_subgrupo_item_e_subitem_cod
            ? converterObjArrayEmHash(conjunturais, 'geral_grupo_subgrupo_item_e_subitem_cod', true)
            : converterObjArrayEmHash(conjunturais, 'setores_e_subsetores_cod', true);

        return Object.keys(conjunturaisKeyValue)
            .map(key => {
                const itens = conjunturaisKeyValue[key];

                const conjuntural = itens[0];
                const posicao = conjuntural.geral_grupo_subgrupo_item_e_subitem &&
                    conjuntural.geral_grupo_subgrupo_item_e_subitem.indexOf('. ') >= 0
                    ? conjuntural.geral_grupo_subgrupo_item_e_subitem.split('. ')[0] : '0';

                const indicadorParams = {
                    id: parseInt(conjuntural.var_cod, 10),
                    indicador: conjuntural.var,
                    posicao: posicao,
                    classe: null,
                    children: [],
                    pesquisa_id: pesquisaId,
                    nota: [],
                    fonte: []
                };

                const indicador = Indicador.criar(indicadorParams);

                const res = itens.reduce( (agg, item) => {
                    agg[item.p] = item.v;
                    return agg;
                }, {});

                const periodos = itens.sort( (a,b) => {
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

    // private _ordenarPeriodos(periodos: string[]) {
    //     const _periodos = periodos.map(periodo => ({
    //             original: periodo,
    //             sortable: this._transformPeriodo(periodo)
    //     }));

    //     return _periodos
    //         .sort( (a, b) => a.sortable > b.sortable ? -1 : 1)
    //         .map(obj => obj.original);
    // }

    // private _transformPeriodo(periodo: string) {
    //     /**
    //      * CASE 1: 1º trimestre 2015
    //      */
    //     if (/\d{1,2}\D+\d{2,4}/.test(periodo)) {
    //         return periodo.split(' ').reverse();
    //     }

    //     /**
    //      * CASE 2: agosto 2015
    //      */
    //     if (/\D+\d{2,4}/.test(periodo)) {
    //         return periodo.split(' ').reverse().map(val => _substitutirMes(val));
    //     }
    // }
}

// function _substitutirMes(value) {
//     switch (value) {
//         case 'jan':
//         case 'janeiro':
//             return '01';


//         case 'fev':
//         case 'fevereiro':
//             return '02';

//         case 'mar':
//         case 'março':
//             return '03';

//         case 'abr':
//         case 'abril':
//             return '04';

//         case 'mai':
//         case 'maio':
//             return '05';

//         case 'jun':
//         case 'junho':
//             return '06';

//         case 'jul':
//         case 'julho':
//             return '07';

//         case 'ago':
//         case 'agosto':
//             return '08';

//         case 'set':
//         case 'setembro':
//             return '09';

//         case 'out':
//         case 'outubro':
//             return '10';

//         case 'nov':
//         case 'novembro':
//             return '11';

//         case 'dez':
//         case 'dezembro':
//             return '12';

//         default:
//             return value;
//     }
// }
