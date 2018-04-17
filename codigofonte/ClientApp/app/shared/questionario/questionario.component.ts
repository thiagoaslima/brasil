import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { RouterParamsService } from '../router-params.service';
import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Component({
    selector: 'questionario',
    templateUrl: './questionario.template.html',
    styleUrls: ['./questionario.style.css']
})


export class QuestionarioComponent implements OnInit {
    
    aberto = false;
    esconde = true; //setar para false assim que tiver que entrar em produção (quando todos os serviços estiverem implementados).
    label = "Responder";
    pergunta = 1;
    ultimaPergunta = 7;

    public isBrowser;

    constructor(
        private _routerParamsServ: RouterParamsService,
        private _http: Http,
        @Inject(DOCUMENT) private document: any,
        private modalErrorService: ModalErrorService,
        @Inject(PLATFORM_ID) platformId: string
    ) {
        this.isBrowser = isPlatformBrowser(platformId)
    }

    ngOnInit() {

        if(!this.getCookie("questionario.respondido") && this.isBrowser){

            setTimeout(() => { this.esconde = false }, 1 * 60 *  1000);
        }        
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

            if(this.isBrowser){

                this.setCookie("questionario.respondido", "true", 365);
            }

            this._http.post("/questionario", {
                
                email: formulario.email.value,
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
                //this.setCookie("questionario.respondido", "true", 365)
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
            });
        }
    }

    private setCookie(cname, cvalue, exdays) {

        if(!this.isBrowser){
            return;
        }

        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    private getCookie(cname) {

        if(!this.isBrowser){
            return "";
        }

        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for(let i = 0; i <ca.length; i++) {

            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    }
}