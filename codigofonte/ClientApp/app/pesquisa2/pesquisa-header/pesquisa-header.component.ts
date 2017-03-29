import { Component, OnInit, Input } from '@angular/core';
import {Pesquisa} from '../../shared2/pesquisa/pesquisa.model';
import {Localidade} from '../../shared2/localidade/localidade.model';

@Component({
    selector: 'pesquisa-header',
    templateUrl: './pesquisa-header.template.html',
    styleUrls: ['./pesquisa-header.style.css']
})

export class PesquisaHeaderComponent implements OnInit {
    @Input() pesquisa: Pesquisa;
    @Input() localidade: Localidade;

    constructor() { }

    ngOnInit() { }
}