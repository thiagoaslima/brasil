import { Component, OnInit } from '@angular/core';

import { isBrowser } from 'angular2-universal';

import { RouterParamsService } from '../router-params.service';

@Component({
    selector: 'nao-achei',
    templateUrl: './nao-achei.component.html',
    styleUrls: ['./nao-achei.component.css']
})

//TODO
//Criar Timer para fazer aparecer?

export class NaoAcheiComponent implements OnInit {
    
    aberto = false;
    esconde = true; //setar para false assim que tiver que entrar em produção (quando todos os serviços estiverem implementados).

    constructor(
        private _routerParamsServ: RouterParamsService
    ) { }

    ngOnInit() {
        
    }
}