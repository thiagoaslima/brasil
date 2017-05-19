import { Component, OnDestroy, OnInit } from '@angular/core';

import { AppState } from '../../shared2/app-state';
import { PANORAMA, ItemConfiguracao } from '../configuration';
import { CacheFactory } from '../../cache/cacheFactory.service';
import { SyncCache } from '../../cache/decorators';
import { converterObjArrayEmHash, getProperty } from '../../utils2';
import { ResultadoService3 } from '../../shared3/services';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

const cache = CacheFactory.createCache('configuracao', 3);
@Component({
    selector: 'panorama-shell',
    templateUrl: './panorama-shell.template.html'
})
export class PanoramaShellComponent implements OnInit, OnDestroy {
    public configuracao = [];
    public localidade = null;
    public resultados = [];

    private _configuracao$$: Subscription;

    @SyncCache({
        cache: cache
    })
    static getConfiguracao(tipo) {
        const { temas, indicadores } = PANORAMA[tipo] || { temas: [], indicadores: [] };
        const hash = converterObjArrayEmHash(indicadores, 'tema', true);
        return temas.reduce((agg, tema) => agg.concat(hash[tema]), [] as ItemConfiguracao[]);
    }

    constructor(
        private _appState: AppState,
        private _resultadoService: ResultadoService3
    ) { }

    ngOnInit() {
        this._configuracao$$ = this._appState.observable$
            .map(state => state.localidade)
            .filter(Boolean)
            .distinctUntilChanged()
            .mergeMap(localidade => {
                let configuracao = PanoramaShellComponent.getConfiguracao(localidade.tipo)
                return this._resultadoService
                    .getResultadosCompletos(<number[]>configuracao.map(getProperty('indicadorId')), localidade.codigo)
                    .map(resultados => ({
                        configuracao: configuracao,
                        resultados: resultados,
                        localidade: localidade
                    }))
            })
            .subscribe(({ configuracao, resultados, localidade }) => {
                this.configuracao = configuracao;
                this.resultados = resultados;
                this.localidade = localidade;
            });
    }

    ngOnDestroy() {
        this._configuracao$$.unsubscribe()
    }
}