import { Component, OnInit, OnChanges } from '@angular/core';
import {RouterParamsService} from '../../shared/router-params.service'
import {SinteseService} from '../sintese.service'
import {LocalidadeService} from '../../shared/localidade/localidade.service'

@Component({
    selector: 'sintese-header',
    templateUrl: 'sintese-header.template.html',
    styleUrls: ['sintese-header.style.css']
})
export class SinteseHeaderComponent {

    ativo = 'grafico'; //pode ser 'grafico' ou 'mapa'
    titulo;
    pesquisa;
    codPesquisa;

    constructor(
        private _routerParams:RouterParamsService,
        private _sintese:SinteseService,
        private _localidade:LocalidadeService
    ){}

    ngOnInit(){
        this._routerParams.params$.subscribe((params)=>{
            if(params.indicador){
                let dadosMunicipio = this._localidade.getMunicipioBySlug(params.uf, params.municipio);
                let codigoMunicipio = dadosMunicipio.codigo.toString().substr(0, 6);
                let dadosPesquisa = this._sintese.getPesquisaByIndicadorDaSinteseMunicipal(params.indicador);
                this._sintese.getDetalhesIndicadorSintese(codigoMunicipio, params.indicador).subscribe((dados) => {
                    this.titulo = dados[0].indicador; //descrição textual do indicador presente na rota
                    this.pesquisa = dadosPesquisa.nome; //pega o nome da pesquisa de onde esse indicador vem
                    this.codPesquisa = dadosPesquisa.codigo; //pega o código da pesquida
                });
            }
        });
    }

    ativar(tipo){
        this.ativo = tipo;
    }

}