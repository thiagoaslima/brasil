import { Component, OnInit } from '@angular/core';

import { SeletorLocalidadeService } from '../core/seletor-localidade/seletor-localidade.service';
import { IndicadorService3 } from '../shared3/services';
import { ModalErrorService } from '../core/modal-erro/modal-erro.service';

@Component({
    selector: 'pesquisa-home',
    templateUrl: 'pesquisa-home.component.html',
    styleUrls: ['pesquisa-home.component.css']
})
export class PesquisaHomeComponent implements OnInit {
    public versao = require('../version.json');

    constructor(
        private _seletorLocalidadeService: SeletorLocalidadeService,
        private _indicadorService: IndicadorService3,
        private modalErrorService: ModalErrorService
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
            error => this.modalErrorService.showError());
        }

        this._seletorLocalidadeService.abrirSeletor(niveis.length === 2 ? 'municipios' : '');
    }
}
