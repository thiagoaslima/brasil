import { TraducaoService } from '../traducao/traducao.service';
import { Component, OnInit } from '@angular/core';

import { SeletorLocalidadeService } from '../core/seletor-localidade/seletor-localidade.service';

@Component({
    selector: 'cidades-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    public versao = require('../version.json');

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _seletorLocalidadeService: SeletorLocalidadeService,
        private _traducaoServ: TraducaoService
    ) { }

    ngOnInit() { }

    abrirSeletorLocalidade() {
        this._seletorLocalidadeService.abrirSeletor();
    }
}
