import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ResultadoService3 } from '../../shared3/services';

@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html'
})
export class PanoramaResumoComponent implements OnChanges {
    @Input() configuracao;
    @Input() localidade;

    constructor(
        private _resultadosService: ResultadoService3
    ) {}

    public temas = [];
    public hashDadosPorTema = {};

    ngOnChanges(changes: SimpleChanges) {
        if (Object.hasOwnProperty.call(changes, 'configuracao') && changes.configuracao.currentValue) {
            this.temas = changes.configuracao.currentValue.temas || [];
            this.hashDadosPorTema = changes.configuracao.currentValue.hash || {};
        }
    }

    getResultados(indicadores) {
        
    }
}