import { Component, OnInit, OnChanges } from '@angular/core';
import {RouterParamsService} from '../../shared/router-params.service'
import {SinteseService} from '../sintese.service'

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
        private _routerParams:RouterParamsService,
        private _sintese:SinteseService
    ){}

    ngOnInit(){
        this._routerParams.params$.subscribe((params)=>{
            console.log(params);
            this._sintese.getDetalhesIndicadorSintese('330455', '29171').subscribe((dados) => {
                console.log(dados);
            });
            this.titulo = params.indicador; //pegar o nome real do indicador e da pesquisa de onde ele vem
            this.pesquisa = 'Censo';
        });
    }

    ativar(tipo){
        this.ativo = tipo;
    }

}