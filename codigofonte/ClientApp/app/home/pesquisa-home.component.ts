import { TraducaoService } from '../shared';
import { Component, OnInit } from '@angular/core';

import {
    IndicadorService3
} from '../shared';
import {
    SeletorLocalidadeService,
    ModalErrorService
} from '../core';

@Component({
    selector: 'pesquisa-home',
    templateUrl: 'pesquisa-home.component.html',
    styleUrls: ['pesquisa-home.component.css']
})
export class PesquisaHomeComponent implements OnInit {
    // public versao = require('../version.json');
    public  pesquisas = require('./pesquisas.json');

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _seletorLocalidadeService: SeletorLocalidadeService,
        private _indicadorService: IndicadorService3,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService
    ) { }

    ngOnInit() { }

    selectPesquisa(id: number, niveis: string[]) {
        this._seletorLocalidadeService.bloquearNiveisTerritoriais(niveis);

        if (id === 23) {
            // Censo - sinopse
            this._seletorLocalidadeService.forcePage('/pesquisa/' + id.toString(10) + '/27562');
        } else {
            this._indicadorService.getIndicadoresDaPesquisa(id).take(1).subscribe(indicadores => {
                const indicadorId = indicadores.find(ind => ind.posicao === '1').id;
                this._seletorLocalidadeService.forcePage('/pesquisa/' + id.toString(10) + '/' + indicadorId.toString(10));
            },
            error => {
                console.error(error);;
                this.modalErrorService.showError();
            });
        }

        this._seletorLocalidadeService.abrirSeletor(niveis.length === 2 ? 'municipios' : '');
    }
}
