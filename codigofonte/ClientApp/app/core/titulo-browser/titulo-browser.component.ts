import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isBrowser } from 'angular2-universal';

import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { Localidade} from '../../shared2/localidade/localidade.model';

/*
seta o título da página de acordo com a rota
*/

@Component({
    selector: 'titulo-browser',
    templateUrl: './titulo-browser.template.html'
})
export class TituloBrowserComponent implements OnInit {
    public isBrowser = isBrowser;
    constructor(
        private _pesquisaService: PesquisaService2,
        private _routerParamsService: RouterParamsService,
        private _localidadeService: LocalidadeService2,
        private _titleService: Title,
        private _route: ActivatedRoute
    ) { }

    ngOnInit() {
       this._routerParamsService.params$.subscribe((params) => {
            if(isBrowser && window){
                let titulo = "IBGE | Brasil em Síntese | ";
                let localidade = this._localidadeService.getMunicipioBySlug(params.params.uf, params.params.municipio);
                
                if(localidade.tipo == 'municipio'){
                    titulo += localidade.parent.nome + ' | ' + localidade.nome; //concatena nome da uf e do município
                }else{
                    titulo += localidade.nome; //concatena nome da uf ou 'Brasil'
                }

                let url = window.location.href;
                if(url.indexOf('panorama') >= 0){
                    titulo += ' | Panorama';
                    this._titleService.setTitle(titulo); // titulo panorama
                }else if(url.indexOf('historico') >= 0){
                    titulo += ' | Histórico';
                    this._titleService.setTitle(titulo); // titulo histórico
                }else if(url.indexOf('pesquisa') >= 0){
                    titulo += ' | Pesquisa';
                    if(params.params.pesquisa){
                        this._pesquisaService.getPesquisa(params.params.pesquisa).subscribe((pesquisa) => {
                            pesquisa.indicadores.subscribe((indicadores) => {
                                let indicadorNome = indicadores.length > 0 ? indicadores[0].nome : '';
                                for(let i = 0; i < indicadores.length; i++){
                                    if(indicadores[i].id == params.params.indicador){
                                        indicadorNome = indicadores[i].nome;
                                    }
                                }
                                titulo += ' | ' + pesquisa.nome + ' | ' + indicadorNome;
                                if(params.queryParams.ano){
                                    titulo += ' | ' + params.queryParams.ano;
                                }
                                this._titleService.setTitle(titulo); // titulo pesquisa
                            });
                        });
                    }
                }
            }
        });
    }
}