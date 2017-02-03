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
    dadosMapa = [];
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
            let dados = [
                {"codLocal":"3304557","2010":null,"2015":null,"2016":"6498837","2017":null},
                {"codLocal":"3303609","2010":null,"2015":null,"2016":"8498837","2017":null},
                {"codLocal":"3303708","2010":null,"2015":null,"2016":"2498837","2017":null},
                {"codLocal":"3303807","2010":null,"2015":null,"2016":"5498837","2017":null},
                {"codLocal":"3303401","2010":null,"2015":null,"2016":"3498837","2017":null},
                {"codLocal":"3303906","2010":null,"2015":null,"2016":"7498837","2017":null}
            ];
            // let dados = [
            //     {"codLocal":"33","2010":null,"2015":null,"2016":"6498837","2017":null},
            //     {"codLocal":"11","2010":null,"2015":null,"2016":"8498837","2017":null},
            //     {"codLocal":"52","2010":null,"2015":null,"2016":"2498837","2017":null},
            //     {"codLocal":"31","2010":null,"2015":null,"2016":"5498837","2017":null},
            //     {"codLocal":"32","2010":null,"2015":null,"2016":"3498837","2017":null},
            //     {"codLocal":"41","2010":null,"2015":null,"2016":"7498837","2017":null}
            // ];
            //let dados = [];

            // [{munic:'330455',anos:['2010','2016'], valores:['3252215',null], faixa:'faixa2'}]
            dados.forEach(dado => {
                //Object.keys(dado) //["2010", "2015", "2016", "2017", "codLocal"]
                //Object.keys(dado).length //5
                //dado["2016"] //"8498837"
                //dado[Object.keys(dado)[2]] //"8498837"
                let dadosMunic = {munic:'',anos:[], valores:[], faixa:''};
                dadosMunic.munic = dado.codLocal.substr(0, 6);
                Object.keys(dado).forEach(ano => {
                    if(Object.keys(dado).length > dadosMunic.anos.length+1){
                        dadosMunic.anos.push(ano);
                        dadosMunic.valores.push(dado[ano]);
                    }
                });
                this.dadosMapa.push(dadosMunic);  
            });


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