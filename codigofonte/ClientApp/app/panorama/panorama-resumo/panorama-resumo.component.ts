import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { PanoramaDescriptor, PanoramaConfigurationItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html',
    styleUrls: ['./panorama-resumo.style.css']
})
export class PanoramaResumoComponent implements OnInit, OnChanges {
    @Input() dados: PanoramaDescriptor;
    @Input() localidade: Localidade;
    
    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes) {
        console.log(changes)
    }
}