import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
    comp = 'mapa';
    local = '';

    urlDownloadGrafico = '';

    constructor(
        private route: ActivatedRoute,
        private _sinteseService: SinteseService, 
        private _localidadeService: LocalidadeService,
        private _params: RouterParamsService
    ){}


    ngOnInit(){

    this._localidadeService.selecionada$.subscribe((localidade)=> this.local = localidade.codigo.toString());

        this.route.params.filter(params => !!params['indicador'])
            .switchMap((params: Params) => { 

                let codigoMunicipio = this._localidadeService.getMunicipioBySlug(params['uf'], params['municipio']).codigo;
                let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo;

                let indicador = this._sinteseService.getPesquisa(codigoPesquisa, codigoMunicipio + "", [ params['indicador'] ] );

                return indicador;
                
            }).subscribe(valores => this.dadosIndicador = !!valores[0] ? valores[0].res :  '{}');
    }

    handleAtivarComponente(comp) {
        this.comp = comp;
    }

    setImagemGrafico(event: Event){


        this.urlDownloadGrafico = event['url'];
    }
}