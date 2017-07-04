import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isBrowser } from 'angular2-universal';

import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { Localidade} from '../../shared2/localidade/localidade.model';

/*
seta as metatags da página de acordo com a rota
*/

@Component({
    selector: 'metatag-browser',
    templateUrl: './metatag-browser.template.html'
})
export class MetatagBrowserComponent implements OnInit {
    public isBrowser = isBrowser;
    constructor(
        private _pesquisaService: PesquisaService2,
        private _routerParamsService: RouterParamsService,
        private _localidadeService: LocalidadeService2,
        private _route: ActivatedRoute
    ) { }

    ngOnInit() {
       this._routerParamsService.params$.subscribe((params) => {
            if(isBrowser && window){
                let local = "";
                let localidade = this._localidadeService.getMunicipioBySlug(params.params.uf, params.params.municipio);

                if(localidade.tipo == 'municipio'){
                    local += 'cidade: ' + localidade.nome + ' | estado: ' + localidade.parent.nome; //concatena nome da uf e do município
                }else{
                    local += localidade.nome; //concatena nome da uf ou 'Brasil'
                }

                let url = window.location.href;
                if(url.indexOf('panorama') >= 0){
                    //seta a metatag description
                    this.setaMetatag('description', 'Panorama geral com dados geográficos e estatísticos do IBGE (' + local + ')');
                    //seta a metatag keywords
                    this.setaMetatag('keywords', 'IBGE,dados,geografia,estatística,cidade,município,país,estado,PIB,IDH,IDEB,população,mapa,censo,panorama,' + localidade.nome + (localidade.parent ? ',' + localidade.parent.nome : ''));
                }else if(url.indexOf('historico') >= 0){
                    //seta a metatag description
                    this.setaMetatag('description', 'História e fotos (' + local + ')');
                    //seta a metatag keywords
                    this.setaMetatag('keywords', 'IBGE,dados,geografia,estatística,cidade,município,país,estado,PIB,IDH,IDEB,população,mapa,censo,história,fotos,' + localidade.nome + (localidade.parent ? ',' + localidade.parent.nome : ''));
                }else if(url.indexOf('pesquisa') >= 0){
                    if(params.params.pesquisa){
                        this._pesquisaService.getPesquisa(params.params.pesquisa).subscribe((pesquisa) => {
                            //seta a metatag description
                            this.setaMetatag('description', 'Pesquisa - ' + pesquisa['nome'] + ' - (' + local + ')');
                            //seta a metatag keywords
                            this.setaMetatag('keywords', 'IBGE,dados,geografia,estatística,cidade,município,país,estado,PIB,IDH,IDEB,população,mapa,censo,pesquisa,' + localidade.nome + (localidade.parent ? ',' + localidade.parent.nome : ''));
                        });
                    }
                }
            }
        });
    }

    //seta a metatag, criando-a caso necessário
    private setaMetatag(nome: string, conteudo: string){
        let metatags = document.getElementsByTagName('head')[0].getElementsByTagName('meta');
        for(let i = 0; i < metatags.length; i++){
            if(metatags[i]['name'] == nome){
                metatags[i]['content'] = conteudo;
                return;
            }
        }
        let metatag = document.createElement('meta');
        metatag['name'] = nome;
        metatag['content'] = conteudo;
        document.getElementsByTagName('head')[0].appendChild(metatag);
    }

}
