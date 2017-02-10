import { Injectable } from '@angular/core';

import { Localidade } from '../../shared/localidade/localidade.interface';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { Indicador, Pesquisa } from '../../shared/pesquisa/pesquisa.interface';
import { PesquisaService } from '../../shared/pesquisa/pesquisa.service';
import { SystemCacheService } from '../../shared/system-cache.service';
import { slugify } from '../../utils/slug';
import { flatTree } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class BuscaService {

    private _cacheKeys = {
        "busca": (termo: string) => `busca/${termo}`
    }
    private _localidades = flatTree(this._localidadeService.getRoot());

    constructor(
        private _cache: SystemCacheService,
        private _localidadeService: LocalidadeService,
        private _pesquisaService: PesquisaService
    ) { }

    search(termo: string): Observable<{ pesquisas: Pesquisa[], indicadores: Indicador[], localidades: Localidade[] }> {
        termo = slugify(termo.trim());
        const cacheKey = this._cacheKeys.busca(termo);

        if (this._cache.has(cacheKey)) {
            return Observable.of(this._cache[cacheKey]);
        }

        let filtro = this._filterSearchResponse(termo);
        let _termo = termo.slice(0, -1);

        while (_termo ) {
            if (this._cache.has(this._cacheKeys.busca(_termo))) {
                break;
            }
            _termo = _termo.slice(0, -1)
        }

        let pesquisas$ = this._pesquisaService.getAllPesquisas();
        // let pesquisas$: Observable<Pesquisa[]> = _termo
        //     ? this._cache.get(_termo).pesquisas
        //     : this._pesquisaService.getAllPesquisas();

        let indicadores$: Observable<Indicador[]> = this._pesquisaService.getIndicadores(23);


        let localidade$: Observable<Localidade[]> = Observable.of(this._localidades);

        return Observable.zip(pesquisas$, indicadores$, localidade$)
            .map(([pesquisa, indicadores, localidades]) => {
                let pesquisas = [pesquisa].filter(filtro.pesquisa);
                indicadores = indicadores.filter(filtro.indicador);
                localidades = localidades.filter(filtro.localidade);

                return { pesquisas, indicadores, localidades }
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
                return slugify(indicador.indicador).includes(termo) || indicador.id.toString().includes(termo);
            }
        }
    }
}