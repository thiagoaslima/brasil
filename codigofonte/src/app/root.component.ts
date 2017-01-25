import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalidadeService } from './shared/localidade/localidade.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'root',
    templateUrl: 'root.template.html'
})
export class RootComponent implements OnInit, OnDestroy{
    locais;
    localidadeSelecionada;
    private _localSelecionada$$: Subscription

    constructor(
        private _localidadeService: LocalidadeService
    ) {
        this.locais = _localidadeService.tree$;
    }

    ngOnInit() {
        this._localSelecionada$$ = this._localidadeService.selecionada$.subscribe(localidade => this.localidadeSelecionada = localidade);
    }

    ngOnDestroy() {
        this._localSelecionada$$.unsubscribe();
    }

}