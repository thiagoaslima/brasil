import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { SinteseService } from '../sintese.service';

@Component({
    selector: 'historico',
    templateUrl: 'historico.template.html',
    styleUrls: ['historico.style.css']
})
export class HistoricoComponent implements OnInit {

    historico;
    isCarregando = false;

    constructor(
        private _localidadeService: LocalidadeService,
        private _sinteseService: SinteseService
    ) {  }

    ngOnInit(){

        this._localidadeService.selecionada$
                .filter(localidade => localidade.tipo == 'municipio')
                .flatMap(localidade => {
                    this.isCarregando = true;
                    return this._sinteseService.getHistorico(localidade.codigo);
                }).subscribe(historico => {
                        this.historico = historico
                        this.isCarregando = false;
                });

    }

    isHistoricoVazio(): boolean {

        return  !this.historico.historico && 
                !this.historico.fonte &&
                !this.historico.formacaoAdministrativa;
    }
}