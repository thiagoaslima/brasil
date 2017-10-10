import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { isBrowser } from 'angular2-universal';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';
import { RouterParamsService } from '../router-params.service';


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
    esconde = true;
    enviado = false;
    url = '';

    constructor(
        private _routerParamsServ: RouterParamsService,
        private _http: Http,
        private modalErrorService: ModalErrorService
    ) {}

    static timer;

    ngOnInit() {
        if(isBrowser){
            if(NaoAcheiComponent.timer == undefined)
                NaoAcheiComponent.timer = setTimeout(()=>this.esconde = false, 1);
        }
    }

    enviar(email, assunto, mensagem){
        if(isBrowser){
            this.url = '\n\nPágina de origem: ' + window.location.href;
        }
        this._http.post("/feedback", {
            email: email,
            assunto: assunto,
            mensagem: mensagem + this.url
        }, options)
        .subscribe(res => {
            //console.log("ok", res);
        },
        error => this.modalErrorService.showError());

        this.enviado = true;
        this.aberto = false;
    }

    esconder(){
        this.esconde = true;
    }

    abreFecha(){
        this.aberto = !this.aberto;
    }
}