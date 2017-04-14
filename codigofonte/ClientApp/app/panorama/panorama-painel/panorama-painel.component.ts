import { Component, Input, OnInit, OnChanges, SimpleChange, ChangeDetectionStrategy } from '@angular/core';

import { Indicador } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { IsMobileService } from '../../shared/is-mobile.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'panorama-painel',
    templateUrl: './panorama-painel.template.html',
    styleUrls: ['./panorama-painel.style.css']
    // template:`
    //     <div>
    //         <h2>{{dados.tema}}</h2>
            
    //         <div>
    //             <div class="cartograma">
    //                 <cartograma [localidade]="uf" [indicador]="indicador$ | async"></cartograma>
    //             </div>
    //         </div>
            
    //         <div class="cards">
    //             <panorama-card (click)="selectPainel(painel)"  *ngFor="let painel of dados" [dados]="painel" [localidade]="localidade" [selecionado]="painel?.indicadorId === localSelecionado"></panorama-card>
    //         </div>
    //    </div>`,
    // styles: [`
    //     .cards{
    //         content: "";
    //         display: table;
    //         clear: both;
    //         margin: 2% 5%;
    //     }

    //     .cartograma {
    //         margin: 3% 5%;
    //     }

    //     .legenda {
    //         display: inline-block;
    //         width: 29%;
    //     }
        
    // `],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaPainelComponent implements OnInit, OnChanges {
    @Input() dados: PanoramaConfigurationItem;
    @Input() localidade: Localidade;

    public uf: Localidade;
    public indicador$: Observable<Indicador>
    public localSelecionado;
    private _selecionarIndicador$ = new BehaviorSubject<Indicador>(null);
    private _resultados = Object.create(null);
    private _rankings = Object.create(null);
    
    constructor (
        private _isMobileServ:IsMobileService
        ){
        
    }

    isMobile(){
        return this._isMobileServ.any(); 
    }

    ngOnInit() {
        this.indicador$ = this._selecionarIndicador$
            .filter(Boolean)
            .do(indicador => this.localSelecionado = indicador.id);
    }

    ngOnChanges(changes: { [label: string]: SimpleChange }) {
        if (changes.hasOwnProperty('localidade') && Boolean(changes.localidade.currentValue)) {
            this.uf = changes.localidade.currentValue.parent;
        }

        if (changes.hasOwnProperty('dados') && Boolean(changes.dados.currentValue) && Boolean(changes.dados.currentValue.length)) {
            this._selecionarIndicador$.next(changes.dados.currentValue[0].indicador)
        }
    }

    selectPainel(obj) {
        this._selecionarIndicador$.next(obj.indicador)
    }

    trackByIndicadorId(index, card) {
        return card.indicador ? card.indicador.id : undefined;
    }
}