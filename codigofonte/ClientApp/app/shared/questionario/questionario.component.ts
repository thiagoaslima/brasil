import { Component, OnInit } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { RouterParamsService } from '../router-params.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

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
        private _routerParamsServ: RouterParamsService,
        private _http: Http
    ) { }

    ngOnInit() {
        
    }

    avancar(formulario){
        if(!this.aberto){
            this.aberto = true;
            this.label = "Avançar";
        }else if(this.pergunta < this.ultimaPergunta){
            this.pergunta += 1;
        }
        
        //envia o formulário
        if(this.pergunta == this.ultimaPergunta){
            this._http.post("/questionario", {
                respostas: [
                    {
                        questao: 1,
                        value: formulario.pergunta1.value,
                        observacao: null
                    },
                    {
                        questao: 2,
                        value: formulario.pergunta2.value,
                        observacao: null
                    },
                    {
                        questao: 3,
                        value: formulario.pergunta3.value,
                        observacao: null
                    },
                    {
                        questao: 4,
                        value: formulario.pergunta4.value,
                        observacao: formulario.outros.value
                    },
                    {
                        questao: 5,
                        value: formulario.mensagem.value,
                        observacao: null
                    }
                ]
            }, options)
            .subscribe(res => {
                //console.log("ok", res);
            });
        }
    }
}