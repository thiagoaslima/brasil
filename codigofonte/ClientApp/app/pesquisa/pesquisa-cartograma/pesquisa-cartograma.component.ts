import { Component, OnInit } from '@angular/core';

import { LinhaTempo } from '../../infografia/linha-tempo/linha-tempo.component';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
    selector: 'pesquisa-cartograma',
    templateUrl: './pesquisa-cartograma.template.html',
    styleUrls: ['./pesquisa-cartograma.style.css']
})

export class PesquisaCartogramaComponent implements OnInit {

    constructor() { }

    ngOnInit() { }

    mudaAno(ano){
        console.log(ano);
    }
}