import { Component, Input } from '@angular/core';

@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html'
})
export class PanoramaResumoComponent {
    @Input() configuracao = [];
    @Input() localidade = null;
    @Input() resultados = [];

    constructor() { }

}