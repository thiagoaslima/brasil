import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'panorama-painel',
    template: `
        <div>
            <h2>{{dados.tema}}</h2>
            <div>
                <p>Cartograma</p>
                <cartograma *ngIf="codigoUf" [localidade]="codigoUf"></cartograma>
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
    `]
})
export class PanoramaPainelComponent implements OnChanges {
    @Input() dados;
    @Input() localidade;

    public codigoUf: number;

    ngOnChanges(changes: { [label: string]: SimpleChange }) {
        if (changes.hasOwnProperty('localidade') && Boolean(changes.localidade.currentValue)) {
            this.codigoUf = changes.localidade.currentValue.codigo.toString().substring(0, 2);
        }
    }
}