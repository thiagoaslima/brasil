import { Component, Input, OnInit, OnChanges, SimpleChange, ChangeDetectionStrategy } from '@angular/core';

import { Indicador } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'panorama-painel',
    template: `
        <div>
            <h2>{{dados.tema}}</h2>
            
            <div>
                <div class="cartograma">
                    <cartograma [localidade]="uf" [indicador]="indicador$ | async"></cartograma>
                </div>
                <div class="legenda">
                    
                </div>
            </div>
            
            <div class="cards">
                <panorama-card  *ngFor="let painel of dados" [dados]="painel" [localidade]="localidade"></panorama-card>
            </div>

        </div>
    `,
    styles: [`
        .cards{
            content: "";
            display: table;
            clear: both;
            margin: 2% 5%;
        }

        .cartograma {
            padding-top: 1em;
            display: inline-block;
            width: 70%;
            margin-left: 40px;
        }
        .legenda {
            display: inline-block;
            width: 29%;
        }
        
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaPainelComponent implements OnInit, OnChanges {
    @Input() dados;
    @Input() localidade;

    public uf: Localidade;
    public indicador$: Observable<Indicador>
    private _selecionarIndicador$ = new BehaviorSubject<Indicador>(null);

    ngOnInit() {
        this.indicador$ = this._selecionarIndicador$.filter(Boolean);
    }

    ngOnChanges(changes: { [label: string]: SimpleChange }) {
        if (changes.hasOwnProperty('localidade') && Boolean(changes.localidade.currentValue)) {
            this.uf = changes.localidade.currentValue.parent;
        }

        if (changes.hasOwnProperty('dados') && Boolean(changes.dados.currentValue) && Boolean(changes.dados.currentValue.length)) {
            this._selecionarIndicador$.next(changes.dados.currentValue[0].indicador)
        }
    }
}