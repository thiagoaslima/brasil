import { Component, OnInit } from '@angular/core';

import { isBrowser } from 'angular2-universal';

import { RouterParamsService } from '../router-params.service';

@Component({
    selector: 'questionario',
    templateUrl: './questionario.template.html',
    styleUrls: ['./questionario.style.css']
})

//TODO
//Criar Timer para fazer aparecer?

export class QuestionarioComponent implements OnInit {
    
    aberto = false;
    esconde = true; //setar para false assim que tiver que entrar em produção (quando todos os serviços estiverem implementados).
    label = "Responder";
    pergunta = 1;
    ultimaPergunta = 6;

    constructor(
        private _routerParamsServ: RouterParamsService
    ) { }

    ngOnInit() {
        
    }

    avancar(){
        if(!this.aberto){
            this.aberto = true;
            this.label = "Avançar";
        }else if(this.pergunta < this.ultimaPergunta){
            this.pergunta += 1;
        }
    }
}