import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';

import { LocalidadeService } from '../shared/localidade/localidade.service';
import { SinteseService } from './sintese.service';



@Component({
    selector: 'sintese',
    templateUrl: 'sintese.template.html',
})
export class SinteseComponent implements OnInit {
    
    public tipoSintese;
    public conteudoSintese
    public baseURL;

    private _dadosSinteseSubscription: Subscription;


    constructor(
        private _localidadeService: LocalidadeService,
        private _sinteseService: SinteseService
    ){};

    ngOnInit(){

        debugger;
        this.obterDadosSintese();
    }

    private obterDadosSintese(){

        debugger;

        this._dadosSinteseSubscription = this._localidadeService.selecionada$
            .flatMap(localidade => {

                this.tipoSintese = this.selecionarNivelSintese(localidade);

                this.baseURL = localidade.link;

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