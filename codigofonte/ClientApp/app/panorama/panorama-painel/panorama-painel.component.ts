import { Component, Input } from '@angular/core';

@Component({
    selector: 'panorama-painel',
    template: `
        <div>
            <h2>{{dados.tema}}</h2>
            <div>
                <p>Cartograma</p>
            </div>
            <panorama-card *ngFor="let painel of dados.painel" [dados]="painel" [localidade]="localidade"></panorama-card>
        </div>
    `
})
export class PanoramaPainelComponent {
    @Input() dados;
    @Input() localidade;
}