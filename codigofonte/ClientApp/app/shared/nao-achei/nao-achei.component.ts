import { Component, OnInit } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { RouterParamsService } from '../router-params.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Component({
    selector: 'nao-achei',
    templateUrl: './nao-achei.template.html',
    styleUrls: ['./nao-achei.style.css']
})

//TODO
//Criar Timer para fazer aparecer?

export class NaoAcheiComponent implements OnInit {
    
    aberto = false;
    esconde = true; //setar para false assim que tiver que entrar em produção (quando todos os serviços estiverem implementados).
    enviado = false;

    constructor(
        private _routerParamsServ: RouterParamsService,
        private _http: Http
    ) {}

    static timer;

    ngOnInit() {
        if(isBrowser){
            if(NaoAcheiComponent.timer == undefined)
                NaoAcheiComponent.timer = setTimeout(()=>this.esconde = false, 10000);
        }
    }

    enviar(email, assunto, mensagem){
        this._http.post("https://brasil.homolog.ibge.gov.br/feedback", {
            email: email,
            assunto: assunto,
            mensagem: mensagem
        }, options)
        .subscribe(res => {
            //console.log("ok", res);
        });

        this.enviado = true;
        this.aberto = false;
    }

    clique(){
        if(this.enviado){
            this.esconde = true;
        }else{
            this.aberto = !this.aberto;
        }
    }
}