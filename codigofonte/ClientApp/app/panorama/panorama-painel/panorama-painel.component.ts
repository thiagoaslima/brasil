import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { Localidade } from '../../shared2/localidade/localidade.model';

@Component({
    selector: 'panorama-painel',
    template: `
        <div>
            <h2>{{dados.tema}}</h2>
            <div>
                <p>Cartograma</p>
                <div class="cartograma">
                    <cartograma *ngIf="codigoUf" [localidade]="uf"></cartograma>
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
            display: inline-block;
            width: 70%;
        }
        .legenda {
            display: inline-block;
            width: 29%;
        }
        
    `]
})
export class PanoramaPainelComponent implements OnChanges {
    @Input() dados;
    @Input() localidade;

    public uf;

    ngOnChanges(changes: { [label: string]: SimpleChange }) {
        if (changes.hasOwnProperty('localidade') && Boolean(changes.localidade.currentValue)) {
            this.uf = changes.localidade.currentValue.parent;
        }
    }
}