import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppState } from '../../shared2/app-state';
import { SinteseService } from '../sintese.service';

@Component({
    selector: 'historico',
    templateUrl: 'historico.template.html',
    styleUrls: ['historico.style.css']
})
export class HistoricoComponent implements OnInit {

    historico = {
        historico: '',
        fonte: '',
        formacaoAdministrativa: ''
    };
    isCarregando = false;

    constructor(
        private _appState: AppState,
        private _sinteseService: SinteseService
    ) { }

    ngOnInit() {

        this._appState.observable$
            .filter(state => Boolean(state.localidade) && state.tipo == 'municipio')
            .map(state => state.localidade)
            .flatMap(localidade => {
                this.isCarregando = true;
                return this._sinteseService.getHistorico(localidade.codigo);
            }).subscribe(historico => {
                if (historico.historico)
                    historico.historico = historico.historico.replace(/\n/g, '<br>');
                if (historico.formacaoAdministrativa)
                    historico.formacaoAdministrativa = historico.formacaoAdministrativa.replace(/\n/g, '<br>');
                this.historico = historico;
                this.isCarregando = false;
            });

    }

    isHistoricoVazio(): boolean {

        return !this.historico.historico &&
            !this.historico.fonte &&
            !this.historico.formacaoAdministrativa;
    }
}