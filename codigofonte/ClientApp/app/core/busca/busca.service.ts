import { Injectable } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal/browser';

import { Localidade } from '../../shared/localidade/localidade.interface';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { Indicador, Pesquisa } from '../../shared/pesquisa/pesquisa.interface.2';
import { PesquisaService } from '../../shared/pesquisa/pesquisa.service.2';
import { SystemCacheService } from '../../shared/system-cache.service';
import { slugify } from '../../utils/slug';
import { flat, flatTree, flatMap } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';

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

        while (_termo) {
            if (this._cache.has(this._cacheKeys.busca(_termo))) {
                break;
            }
            _termo = _termo.slice(0, -1)
        }

        let pesquisas$ = this._pesquisaService.getAllPesquisas();
        // let pesquisas$: Observable<Pesquisa[]> = _termo
        //     ? this._cache.get(_termo).pesquisas
        //     : this._pesquisaService.getAllPesquisas();

        let indicadores$ = pesquisas$.flatMap(pesquisas => {
            return Observable.forkJoin(...pesquisas.map(pesquisa => this._pesquisaService.getIndicadoresDaPesquisa(pesquisa.id).map(indicadores => flatTree(indicadores))));
        }).map( (indicadores: Indicador[][]) => flat(indicadores));     
    
        if (isBrowser) {
            window['indicadores'] = indicadores$;
            window['_cache'] = this._cache;
        }

        let localidade$: Observable<Localidade[]> = Observable.of(this._localidades);

        return Observable.zip(pesquisas$, indicadores$, localidade$)
            .map(([pesquisas, indicadores, localidades]) => {

                pesquisas = pesquisas.filter(filtro.pesquisa);
                
                let hash = indicadores.filter(filtro.indicador).reduce( (obj, indicador) => {
                    obj[indicador.pesquisa.id] = indicador.pesquisa;
                    return obj;
                }, {});

                Object.keys(hash).forEach(key => {
                    let pesquisa = hash[key];
                    if (pesquisas.indexOf(pesquisa) === -1) {
                        pesquisas.push(pesquisa);
                    }
                })

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