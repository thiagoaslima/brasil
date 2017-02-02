import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { Observable } from 'rxjs/Observable';


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
    dadosMapa;
    indicador = [];

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


            //DADOS PARA O MAPA COROPLÉTICO
  /*          this.route.params.filter(params => !!params['indicador'])
            .switchMap((params: Params) => { 

                let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo;

                //let ufMunicipios = 
                this._localidadeService.getUfBySigla(params['uf']).municipios.lista.forEach(municipio => {
                    this.indicador.push(this._sinteseService.getPesquisa(codigoPesquisa, municipio + "", [ params['indicador'] ]) );//.subscribe(val => this.indicador.push(val[0].res))
                });

                // ufMunicipios.forEach(municipio => {
                //     //this.indicador.push(this._sinteseService.getPesquisa(codigoPesquisa, municipio + "", [ params['indicador'] ] ));
                //     this._sinteseService.getPesquisa(codigoPesquisa, municipio + "", [ params['indicador'] ] ).subscribe(val => this.indicador.push(val[0].res))
                // });
                return Observable.zip(this.indicador);
                
            }).subscribe(valores => this.dadosMapa = valores); //!!valores[0] ? valores[0].res :  '{}');
*/
    }

    handleAtivarComponente(comp) {
        this.comp = comp;
    }

    setImagemGrafico(event: Event){


        this.urlDownloadGrafico = event['url'];
    }
}