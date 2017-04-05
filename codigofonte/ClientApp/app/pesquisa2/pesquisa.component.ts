import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { SinteseService } from '../sintese/sintese.service';

import { Localidade } from '../shared2/localidade/localidade.model';
import { Pesquisa } from '../shared2/pesquisa/pesquisa.model';
import { EscopoIndicadores, Indicador } from '../shared2/indicador/indicador.model'

import { RouterParamsService } from '../shared/router-params.service';
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

    pesquisa$;
    localidade: Localidade;

    localidades: number[] = [null, null, null];
    periodo: string;
    
    
    constructor(
        private _routerParams:RouterParamsService,
        private _localidadeService2: LocalidadeService2,
        private _pesquisaService: PesquisaService2,
        private _sintese:SinteseService
    ) { }

    ngOnInit() {

        debugger;

        // TODO: Obter dados da rota em app-state, tanto da pesquisa quanto da localidade
        this.localidade = this._localidadeService2.getMunicipioBySlug('rj', 'rio-de-janeiro');
        


        this._routerParams.params$.subscribe(urlParams => {

            debugger;

            this.pesquisa$ = this._pesquisaService.getPesquisa(urlParams.params['pesquisa']);

            // Obter localidade principal
            this.localidades[0] = (this._localidadeService2.getMunicipioBySlug(urlParams.params['uf'],  urlParams.params['municipio'])).codigo;

            // Obter localidades de comparação
            this.localidades[1] = urlParams.queryParams['localidade1'];
            this.localidades[2] = urlParams.queryParams['localidade2'];

            // Obter período de análise
            this.periodo = urlParams.queryParams['ano'];

        });


    }
}