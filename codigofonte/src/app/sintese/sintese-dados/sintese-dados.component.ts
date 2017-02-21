import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { SINTESE } from '../sintese-config';
import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/pluck';

@Component({
    selector: 'sintese-dados',
    templateUrl: 'sintese-dados.template.html',
    styleUrls: ['sintese-dados.style.css']
})
export class SinteseDadosComponent implements OnInit, OnDestroy {
    @Input() content = [];
    @Input() baseURL = '';

    public conteudo = <{ tema: string, indicadores: any[] }[]>[];
    private _conteudo$$: Subscription;
    private _hashTemas;

    constructor(
        private _localidadeService: LocalidadeService,
        private _sinteseService: SinteseService,
        private _sinteseConfig: SINTESE
    ) { 
        this._hashTemas = this._sinteseConfig.temas.reduce( (agg, tema) => Object.assign(agg, {[tema]: []}), {});
    }

    ngOnInit() {
        let localidade$ = this._localidadeService.selecionada$
            .distinctUntilChanged()
            // .map(localidade => {
            //     this.conteudo = this.resetConteudo();
            //     return localidade;
            // });

        let lista$ = localidade$
            .distinctUntilChanged()
            .map((localidade) => this._sinteseConfig[localidade.tipo])
            .map;

        this._conteudo$$ = Observable.zip(
            localidade$,
            lista$
        ).map( ([localidade, lista]) => this._sinteseService.getConteudo(lista, localidade.codigo))
           
    }

    ngOnDestroy() {
        this._conteudo$$.unsubscribe();
    }

    trackBy(idx, item) {
        return item.id;
    }

    resetConteudo() {
        console.log('reset');
        return this._sinteseConfig.temas.map(tema => ( { tema, indicadores: [] } ))
    }

}