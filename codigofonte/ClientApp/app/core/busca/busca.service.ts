import { Injectable } from '@angular/core';

import {
    Localidade,
    LocalidadeService3,
    Pesquisa,
    PesquisaService3,
    Indicador,
    IndicadorService3
} from '../../shared';
import { slugify } from '../../../utils/slug';
import { flat, flatTree, flatMap } from '../../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class BuscaService {

    private _cacheKeys = {
        "busca": (termo: string) => `busca/${termo}`
    }

    constructor(
        private _localidadeService: LocalidadeService3,
        private _pesquisaService: PesquisaService3,
        private _indicadoresService: IndicadorService3
    ) { }

    search(termo: string): Observable<{ pesquisas: Pesquisa[], localidades: Localidade[] }> {
        termo = slugify(termo.trim());
        const cacheKey = this._cacheKeys.busca(termo);


        let filtro = this._filterSearchResponse(termo);
        let _termo = termo.slice(0, -1);


        let pesquisas$ = this._pesquisaService.getAllPesquisas();
   
        let localidade$: Observable<Localidade[]> = Observable.of(this._localidadeService.buscar(termo));

        return Observable.zip(pesquisas$, localidade$)
            .map(([pesquisas, localidades]) => {

                pesquisas = pesquisas.filter(filtro.pesquisa);
                
                return { pesquisas, localidades }
            });
    }

    private _filterSearchResponse(termo: string) {
        return {
            localidade(localidade: Localidade) {
                return localidade.slug.includes(termo) || localidade.sigla.toLowerCase().includes(termo) || localidade.codigo.toString().includes(termo);
            },

            pesquisa(pesquisa: Pesquisa) {
                return slugify(pesquisa.nome).includes(termo) || pesquisa.id.toString().includes(termo);
            },

            indicador(indicador: Indicador) {
                return slugify(indicador.nome).includes(termo) || indicador.id.toString().includes(termo);
            }
        }
    }
}