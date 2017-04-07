import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';

@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html',
    styleUrls: ['./panorama-temas.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaTemasComponent implements OnInit {
    @Input('dados') temas: {
        tema: string,
        painel: PanoramaConfigurationItem[],
        grafico: GraficoConfiguration[]
    };
    @Input() localidade;

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) { }
}