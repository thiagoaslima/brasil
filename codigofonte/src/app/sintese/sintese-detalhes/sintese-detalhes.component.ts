import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { RouterParamsService } from '../../shared/router-params.service';


/**
 * 
 */
@Component({
    selector: 'sintese-detalhes',
    templateUrl: 'sintese-detalhes.template.html',
    styles: ['sintese-detalhes.style.css']
})
export class SinteseDetalhesComponent implements OnInit {

    dadosIndicador;

    constructor(
        private route: ActivatedRoute,
        private _sinteseService: SinteseService, 
        private _localidadeService: LocalidadeService,
        private _params: RouterParamsService
    ){}

    ngOnInit(){

    // [OK] Incluir links nos indicadores dos dados da síntese 

    // [OK] Obter as informações do indicador selecionado na rota

    // [OK] Obter os dados históricos do indicador
    // [OK] Disponibilizar como parâmetro para o gráfico os dados do indicador
        this.route.params.filter(params => !!params['indicador'])
            .switchMap((params: Params) => { 

                let codigoMunicipio = this._localidadeService.getMunicipioBySlug(params['uf'], params['municipio']).codigo;
                let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo;

                let indicador = this._sinteseService.getPesquisa(codigoPesquisa, codigoMunicipio + "", [ params['indicador'] ] );

                return indicador;
                
            }).subscribe(valoresIndicador => this.dadosIndicador = !!valoresIndicador[0] ? valoresIndicador[0].res :  '{}');
    }

    // No gráfico, ler os dados e exibi-los
}