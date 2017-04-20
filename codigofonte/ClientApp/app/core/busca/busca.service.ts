import { Injectable } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal/browser';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';
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

    constructor(
        private _cache: SystemCacheService,
        private _localidadeService: LocalidadeService2,
        private _pesquisaService: PesquisaService2,
        private _indicadoresService: IndicadorService2
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

            return Observable.forkJoin(...pesquisas.map(pesquisa => { 
                
                let indicadoresPesquisa = this._indicadoresService.getIndicadoresByPosicao(pesquisa.id, '0', EscopoIndicadores.arvore);
   
                return indicadoresPesquisa.map(indicadores => { debugger; return flatTree(indicadores, 'indicadores')});

            }));
        }).map( (indicadores: Indicador[][]) => flat(indicadores));     
    
        let localidade$: Observable<Localidade[]> = Observable.of(this._localidadeService.buscar(termo));

        return Observable.zip(pesquisas$, indicadores$, localidade$)
            .map(([pesquisas, indicadores, localidades]) => {

                pesquisas = pesquisas.filter(filtro.pesquisa);
                
                let hash = indicadores.filter(filtro.indicador).reduce( (obj, indicador) => {
                    obj[indicador.pesquisaId] = indicador.pesquisa;
                    return obj;
                }, {});

                Object.keys(hash).forEach(key => {
                    let pesquisa = hash[key];
                    if (pesquisas.indexOf(pesquisa) === -1) {
                        pesquisas.push(pesquisa);
                    }
                })

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
                return slugify(indicador.nome).includes(termo) || indicador.id.toString().includes(termo);
            }
        }
    }
}