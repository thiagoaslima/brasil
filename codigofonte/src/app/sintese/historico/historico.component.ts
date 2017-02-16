import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { PesquisaService } from '../../shared/pesquisa/pesquisa.service';

@Component({
    selector: 'historico',
    templateUrl: 'historico.template.html',
    styleUrls: ['historico.style.css']
})
export class HistoricoComponent implements OnInit {

    historico;
    isCaixaVisivel = false;
    isCarregando = false;

    constructor(
        private _localidadeService: LocalidadeService,
        private _pesquisaService: PesquisaService
    ) {  }

    ngOnInit(){

        this._localidadeService.selecionada$
                .filter(localidade => localidade.tipo == 'municipio')
                .subscribe(localidade => {

                    debugger;

                    this.isCarregando = true;

                    return this._pesquisaService.getHistorico(localidade.codigo).subscribe(historico => {

                        debugger;

                        this.historico = historico
                        this.isCarregando = false;
                    });
                });
    }

    isHistoricoVazio(): boolean {

        return  !this.historico.historico && 
                !this.historico.historicoFonte &&
                !this.historico.formacaoAdministrativa;
    }

    mostrarCaixa(){

        this.isCaixaVisivel = true;
    }

    esconderCaixa(){

        this.isCaixaVisivel = false;
    }

}