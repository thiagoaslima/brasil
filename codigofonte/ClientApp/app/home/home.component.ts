import { Component, OnInit } from '@angular/core';
import { SeletorLocalidadeService } from '../core';
import { TraducaoService } from "../shared";


@Component({
    selector: 'home',
    // templateUrl: './page404.component.html',
    // styleUrls: ['./page404.component.css']
    templateUrl: 'home.component.html',
    styleUrls: [ 'home.component.css' ],
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
