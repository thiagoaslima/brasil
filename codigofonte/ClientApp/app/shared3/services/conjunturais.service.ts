import { Indicador } from '../../shared2/indicador/indicador.model';
import { ConjunturalDTO } from '../dto/conjuntural.interface';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Resultado } from '../models';
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

    getIndicador(pesquisaId: number, indicadorId: number, categoria?: string): Observable<ConjunturalDTO[]> {
        const params = categoria ? `?categoria=${categoria}` : '';
        const url = servidor.setUrl(`conjunturais/${pesquisaId}/indicadores/${indicadorId}${params}`, 2);
        return this._request(url).catch(err => this._handleError(err));
    }

    getIndicadorAsResultado(pesquisaId: number, indicadorId: number, categoria?: string): Observable<Resultado[]> {
        return this.getIndicador(pesquisaId, indicadorId, categoria)
            .map(array => this._convertConjunturalIntoResultado(pesquisaId, array));
    }

    private _convertConjunturalIntoResultado(pesquisaId: number, conjunturais: ConjunturalDTO[] = []): Resultado[] {
        if (conjunturais.length === 0) { return []; }

        const brasil = this._localidadeService.getRoot();
        const conjunturaisKeyValue: {[cod: string]: ConjunturalDTO[]} = 
            converterObjArrayEmHash(conjunturais, 'geral_grupo_subgrupo_item_e_subitem_cod', true);

        return Object.keys(conjunturaisKeyValue)
            .map(key => {
                const itens = conjunturaisKeyValue[key];

                const conjuntural = itens[0];
                const [posicao, nome] = conjuntural.geral_grupo_subgrupo_item_e_subitem.indexOf('. ') >= 0 
                    ? conjuntural.geral_grupo_subgrupo_item_e_subitem.split('. ')
                    : [0, conjuntural.geral_grupo_subgrupo_item_e_subitem];


                const indicadorParams = {
                    id: parseInt(conjuntural.geral_grupo_subgrupo_item_e_subitem_cod, 10),
                    nome: nome,
                    posicao: posicao,
                    classe: null,
                    pesquisaId: pesquisaId,
                    indicadores: [],
                    nota: [],
                    fonte: []
                };

                const indicador = Indicador.criar(indicadorParams);

                const res = itens.reduce( (agg, item) => {
                    agg[item.p] = item.v;
                    return agg;
                }, {});

                const resultadoParams = {
                    id: parseInt(conjuntural.geral_grupo_subgrupo_item_e_subitem_cod, 10),
                    codigoLocalidade: '0',
                    res: res,
                    indicador: indicador,
                    localidade: brasil
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
}
