import { Component, Input, OnInit } from '@angular/core';

import { PanoramaTema, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { Localidade } from '../../shared2/localidade/localidade.model';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html',
    styleUrls: ['./panorama-resumo.style.css']
})
export class PanoramaResumoComponent implements OnInit {
    @Input('config') configuracao$: Observable<PanoramaTema[]>;
    @Input() localidade: Localidade
    
    constructor() { }

    ngOnInit() { }
}