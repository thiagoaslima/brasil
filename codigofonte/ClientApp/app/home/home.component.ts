import { Component, OnInit } from '@angular/core';

import { SeletorLocalidadeService } from '../core/seletor-localidade/seletor-localidade.service';

@Component({
    selector: 'cidades-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    public versao = require('../version.json');

    constructor(
        private _seletorLocalidadeService: SeletorLocalidadeService
    ) { }

    ngOnInit() { }

    abrirSeletorLocalidade() {
        this._seletorLocalidadeService.abrirSeletor();
    }
}
