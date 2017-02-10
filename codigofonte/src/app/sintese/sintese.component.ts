import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { LocalidadeService } from '../shared/localidade/localidade.service';
import { SinteseService } from './sintese.service';
import { RouterParamsService } from '../shared/router-params.service';


@Component({
    selector: 'sintese',
    templateUrl: 'sintese.template.html',
})
export class SinteseComponent implements OnInit {
    
    public tipoSintese;
    public conteudoSintese
    public baseURL;
    public aberto;

    private _dadosSinteseSubscription: Subscription;


    constructor(
        private _route: ActivatedRoute,
        private _localidadeService: LocalidadeService,
        private _sinteseService: SinteseService,
        private _routerParams:RouterParamsService
    ){};

    ngOnInit(){

        this.obterDadosSintese();
        this.configurarBaseURL();
    }
    
    private configurarBaseURL(){

        this._routerParams.params$.subscribe((params) => {

            //seta a variável de rota base
            if (params.uf && params.municipio){

                this.baseURL = '/brasil/' + params.uf + '/' + params.municipio + '/';

            } else if (params.uf){

                this.baseURL = '/brasil/' + params.uf + '/';

            } else{

                this.baseURL = '/brasil/';
            }
        });

        //verifica se o componente de detalhes está aberto (mobile)
        this._route.queryParams.subscribe(params => {
            if(params['detalhes'] == 'true'){
                this.aberto = true;
            } else {
                this.aberto = false;
            }
        });
    }

    private obterDadosSintese(){

        this._dadosSinteseSubscription = this._localidadeService.selecionada$
            .flatMap(localidade => {

                this.tipoSintese = this.selecionarNivelSintese(localidade);

                return this._sinteseService.getSinteseLocal(localidade.codigo.toString())
            } ) 
            .subscribe(dados => {

                this.conteudoSintese = dados
            });
    }

    private selecionarNivelSintese(localidade){

        let nivel;
        if(localidade.tipo === 'pais'){

            //sintese Brasil
            nivel = this.tipoSintese = 1;

        } else if(localidade.tipo === 'uf'){

            //sintese UF
            nivel = this.tipoSintese = 2;

        } else{

            //sintese município
            nivel = this.tipoSintese = 3;
        }

        return nivel;
    }

}