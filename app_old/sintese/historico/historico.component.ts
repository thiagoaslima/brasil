import { TraducaoService } from '../../traducao/traducao.service';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppState } from '../../shared2/app-state';
import { SinteseService } from '../sintese.service';
import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';


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

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _appState: AppState,
        private _sinteseService: SinteseService,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService
    ) { }

    ngOnInit() {

        this._appState.observable$
            .filter(state => Boolean(state.localidade) /*&& state.tipo == 'municipio'*/)
            .map(state => state.localidade)
            .flatMap(localidade => {

                this.isCarregando = true;
                let codigoLocalidade = localidade.codigo;

                if(localidade.tipo == 'uf'){

                    codigoLocalidade = this.incluirPaddingParaCodigoUF(localidade.codigo);
                }

                return this._sinteseService.getHistorico(codigoLocalidade);

            }).subscribe(historico => {
                if (historico.historico)
                    historico.historico = historico.historico.replace(/\n/g, '<br>');
                if (historico.formacaoAdministrativa)
                    historico.formacaoAdministrativa = historico.formacaoAdministrativa.replace(/\n/g, '<br>');
                this.historico = historico;
                this.isCarregando = false;
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
            });

    }

    isHistoricoVazio(): boolean {
        return  !this.historico || (!this.historico.historico && 
                !this.historico.fonte &&
                !this.historico.formacaoAdministrativa);
    }

    private incluirPaddingParaCodigoUF(codigoUF){

        return parseInt(`${codigoUF}00000`);
    }
}