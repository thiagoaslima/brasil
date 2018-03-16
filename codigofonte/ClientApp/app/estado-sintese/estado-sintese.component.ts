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

import { EstadoSinteseService} from './estado-sintese.service';

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
    selector: 'estado-sintese',
    templateUrl: './estado-sintese.template.html',
    styleUrls: ['./estado-sintese.style.css']
})
export class EstadoSinteseComponent implements OnInit {
    
    public estado;
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
        private _estadoSinteseService : EstadoSinteseService,
        private _indicadorService: IndicadorService3,
        private _pesquisaService: PesquisaService3,
        @Inject(PLATFORM_ID) platformId: string
    ) {
        
        this.resumo.municipios = [];

        this.isBrowser = isPlatformBrowser(platformId);
    }

    static timer;

    ngOnInit() {
      
        if(this.isBrowser){

            this._routerParams.params$.subscribe(({ params, queryParams }) => {

               if(params.uf!=null){

                    this.estado = this._localidadeService.getUfBySigla(params.uf);
               } 
               
                if(queryParams.indicadores!=null){
                    let indicadores = queryParams.indicadores.split(',');
    
                    /* this._estadoSinteseService.getResumoMunicipios(localidade,indicadores).subscribe((resumo)=>{
                        this.resumo = resumo;
                            
                        if(this.resumo!=null && this.resumo.length>0){
                            this.indicadores = this.resumo[0].indicadores;
                            this.notas  = this._estadoSinteseService.getNotasResumo(resumo[0]);
                            this.fontes =    this._estadoSinteseService.getFontesResumo(resumo[0]);
                            }  
                        
                    });*/
                    this._estadoSinteseService.getResumoEstado(this.estado,indicadores).subscribe( (resumo)=>{
                        
                        this.resumo = resumo;
                        if(this.resumo!=null && this.resumo.municipios!=null && this.resumo.municipios.length>0){
                            this.indicadores = this.resumo.municipios[0].indicadores;
                            this.notas  = this._estadoSinteseService.getNotasResumo(this.resumo.municipios[0]);
                            this.fontes =    this._estadoSinteseService.getFontesResumo(this.resumo.municipios[0]);
                        }  
                        console.log(this.indicadores);
                    });
                }
            //    this._localidade$$ = this._appState.observable$
            //         .subscribe(({ localidade }) => {


            //   })
            });
        }
    }

}