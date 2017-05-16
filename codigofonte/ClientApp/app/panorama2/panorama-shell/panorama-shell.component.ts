import { Component, OnDestroy, OnInit } from '@angular/core';

import { AppState } from '../../shared2/app-state';
import { PANORAMA } from '../configuration/panorama.configuration';
import { CacheFactory } from '../../cache/cacheFactory.service';
import { SyncCache } from '../../cache/decorators';
import { converterObjArrayEmHash } from '../../utils2';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

const cache = CacheFactory.createCache('configuracao', 3);
@Component({
    selector: 'panorama-shell',
    templateUrl: './panorama-shell.template.html'
})
export class PanoramaShellComponent implements OnInit, OnDestroy {
    public configuracao = null;
    public localidade = null;

    private _configuracao$$: Subscription;

    @SyncCache({
        cache: cache
    })
    static getConfiguracao(tipo) {
        const { temas, indicadores } = PANORAMA[tipo] || { temas: [], indicadores: [] };
        const hash = converterObjArrayEmHash(indicadores, 'tema');
        return { temas, hash };
    }

    constructor(
        private _appState: AppState
    ) { }

    ngOnInit() {
        this._configuracao$$ = this._appState.observable$
            .map(state => state.localidade)
            .filter(Boolean)
            .distinctUntilChanged()
            .subscribe(localidade => {
                this.configuracao = PanoramaShellComponent.getConfiguracao(localidade.tipo)
                this.localidade = localidade;
            });
    }

    ngOnDestroy() {
        this._configuracao$$.unsubscribe()
    }
}