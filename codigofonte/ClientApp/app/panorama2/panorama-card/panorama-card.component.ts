import { Component, Input } from '@angular/core';


@Component({
    selector: 'panorama-card',
    templateUrl: './panorama-card.template.html',
    styleUrls: ['./panorama-card.style.css']
})
export class PanoramaCardComponent {
    @Input() titulo: string = ''
    @Input() valor: string = ''
    @Input() unidade: string = ''
    @Input() ranking: {[contexto: string]: number} = {}
}