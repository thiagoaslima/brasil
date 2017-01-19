import { Component, OnInit, OnChanges } from '@angular/core';
import {RouterParamsService} from '../../shared/router-params.service'

@Component({
    selector: 'sintese-header',
    templateUrl: 'sintese-header.template.html',
    styleUrls: ['sintese-header.style.css']
})
export class SinteseHeaderComponent {

    ativo = 'grafico';
    titulo;
    pesquisa;

    constructor(
        private _routerParams:RouterParamsService
    ){}

    ngOnInit(){
        this._routerParams.params$.subscribe((params)=>{
            console.log(params);
            this.titulo = params.indicador; //pegar o nome real do indicador e da pesquisa de onde ele vem
            this.pesquisa = 'Censo';
        })
    }

    ativar(tipo){
        this.ativo = tipo;
    }

}