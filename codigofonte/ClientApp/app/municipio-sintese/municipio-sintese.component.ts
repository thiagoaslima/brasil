import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

import { ModalErrorService } from '../core';
import { Subscription } from 'rxjs/Subscription';


import { MunicipioSinteseService} from './municipio-sintese.service';


import {
    AppState,
    RouterParamsService,
    LocalidadeService3,
    IndicadorService3,
    PesquisaService3,
    TraducaoService
} from '../shared';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });


@Component({
    selector: 'municipio-sintese',
    templateUrl: './municipio-sintese.template.html',
    styleUrls: ['./municipio-sintese.style.css']
})



export class MunicipioSinteseComponent implements OnInit {
    
    public estado;


    public municipio;


    public resumo = <any>{};
    public indicadores = [];
    esconde = true;
    enviado = false;
    url = '';
    private _localidade$$: Subscription;
    public notas = [];
    public fontes = [];
    public get lang() {
        return this._traducaoServ.lang;
    }
    public isBrowser;


    constructor(
        private _routerParamsServ: RouterParamsService,
        private _http: Http,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService,
        private _routerParams: RouterParamsService,
        private _localidadeService: LocalidadeService3,
        private _appState: AppState,
        
        
        //private _estadoSinteseService : EstadoSinteseService,

        private _municipioSinteseService : MunicipioSinteseService,
        private _indicadorService: IndicadorService3,
        private _pesquisaService: PesquisaService3,
        @Inject(PLATFORM_ID) platformId,
    ) {
        
        this.resumo.municipios = [];   

        this.isBrowser = isPlatformBrowser(platformId);
    }


    static timer;




    ngOnInit() {
      
        if(this.isBrowser){

            this._routerParams.params$.subscribe(({ params, queryParams }) => {

                // debugger;

                if(params.uf!=null){

                    this.estado = this._localidadeService.getUfBySigla(params.uf);
               } 

               if((params.uf!=null) && (params.municipio!=null)){

                    this.municipio = this._localidadeService.getMunicipioBySlug(params.uf, params.municipio);
               } 
               
                if(queryParams.indicadores!=null){
                    let indicadores = queryParams.indicadores.split(',');


                   this._municipioSinteseService.getResumoMunicipio(this.municipio,indicadores).subscribe( (resumo)=>{
                        // debugger;
                        this.resumo = resumo;
                        

                        if(this.resumo!=null && this.resumo.municipio!=null){                            

                             this.indicadores = this.resumo.indicadores;                   
 
                            // debugger;

                            this.notas  = this._municipioSinteseService.getNotasResumo(this.resumo);

                            // debugger;

                            this.fontes =    this._municipioSinteseService.getFontesResumo(this.resumo);
                        }  
                        console.log(this.indicadores);
                    });


                }
            
            });
        }
    }

}
