import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SinteseService } from '../sintese/sintese.service';

import { Localidade } from '../shared2/localidade/localidade.model';
import { Pesquisa } from '../shared2/pesquisa/pesquisa.model';
import { EscopoIndicadores, Indicador } from '../shared2/indicador/indicador.model'

import { LocalidadeService2 } from '../shared2/localidade/localidade.service';
import { PesquisaService2 } from '../shared2/pesquisa/pesquisa.service';
import { IndicadorService2 } from '../shared2/indicador/indicador.service';

import { flatTree } from '../utils/flatFunctions';

@Component({
    selector: 'pesquisa',
    templateUrl: './pesquisa.template.html',
    styleUrls: ['./pesquisa.style.css']
})

export class PesquisaComponent2 implements OnInit {

    localidade: Localidade;
    localidade2: Localidade;
    localidade3: Localidade;
    localidades: Localidade[];
    periodo: string = "2014";
    pesquisa$;
    


    constructor(
        private _localidadeService2: LocalidadeService2,
        private _pesquisaService: PesquisaService2,
        private _indicadorService2: IndicadorService2,
        private _sintese:SinteseService
    ) { }

    ngOnInit() {

        // TODO: Obter dados da rota em app-state, tanto da pesquisa quanto da localidade
        this.localidade = this._localidadeService2.getMunicipioBySlug('rj', 'rio-de-janeiro');
        this.localidade2 = this._localidadeService2.getMunicipioBySlug('se', 'aracaju');
        this.localidade3 = this._localidadeService2.getMunicipioBySlug('es', 'vitoria');
        this.localidades = [this.localidade, this.localidade2, this.localidade3];
        this.pesquisa$ = this._pesquisaService.getPesquisa(22);


    }


}