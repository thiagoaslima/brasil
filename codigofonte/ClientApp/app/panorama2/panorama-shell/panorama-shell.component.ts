import { Component, OnDestroy, OnInit } from '@angular/core';

import { AppState } from '../../shared2/app-state';
import { PANORAMA } from '../configuration/panorama.configuration';
import { CacheFactory } from '../../cache/cacheFactory.service';
import { SyncCache } from '../../cache/decorators';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

const cache = CacheFactory.createCache('configuracao', 3);
@Component({
    selector: 'panorama-shell',
    templateUrl: './panorama-shell.template.html'
})
export class PanoramaShellComponent implements OnInit, OnDestroy{
    public configuracao = null;

    private _configuracao$$: Subscription;
    
@SyncCache({
        cache: cache
    })
    static getConfiguracao(tipo) {
        return PANORAMA[tipo] || {temas: [], indicadores: []}
    }

    constructor(
        private _appState: AppState
    ) {}

    ngOnInit() {
        this._configuracao$$ = this._appState.observable$
            .map(state => state.tipo)
            .filter(Boolean)
            .distinctUntilChanged()
            .subscribe(tipo => this.configuracao = PanoramaShellComponent.getConfiguracao(tipo));
    }

    ngOnDestroy() {
        this._configuracao$$.unsubscribe()
    }
}