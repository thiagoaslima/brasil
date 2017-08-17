import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isBrowser } from 'angular2-universal';

import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';

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
        this._routerParamsService.params$.subscribe(({ params }) => {
            if (isBrowser && window) {
                let local = '';
                let localidade = params.municipio ? this._localidadeService.getMunicipioBySlug(params.uf, params.municipio) : 
                                 params.uf ? this._localidadeService.getUfBySigla(params.uf) 
                                 : this._localidadeService.getRoot();

                if (localidade) {
                    if (localidade.tipo == 'municipio') {
                        local += 'cidade: ' + localidade.nome + ' | estado: ' + localidade.parent.nome; // concatena nome da uf e do município
                    } else {
                        local += localidade.nome; // concatena nome da uf ou 'Brasil'
                    }
                }

                let url = window.location.href;
                if (url.indexOf('panorama') >= 0) {
                    // seta a metatag description
                    this.setaMetatag('description', 'Conheça o perfil das cidades brasileiras, através de infográficos, mapas e outras informações sobre temas relevantes, como Censo, PIB, IDH e IDEB (' + local + ').');
                    // seta a metatag keywords
                    this.setaMetatag('keywords', 'IBGE,dados,geografia,estatística,cidade,município,país,estado,PIB,IDH,IDEB,população,mapa,censo,panorama,' + localidade.nome + (localidade.parent ? ',' + localidade.parent.nome : ''));
                } else if (url.indexOf('historico') >= 0) {
                    // seta a metatag description
                    this.setaMetatag('description', 'Conheça a história das cidades, vendo também as suas fotografias históricas (' + local + ').');
                    // seta a metatag keywords
                    this.setaMetatag('keywords', 'IBGE,dados,geografia,estatística,cidade,município,país,estado,PIB,IDH,IDEB,população,mapa,censo,história,fotos,' + localidade.nome + (localidade.parent ? ',' + localidade.parent.nome : ''));
                } else if (url.indexOf('pesquisa') >= 0) {
                    if (params.pesquisa) {
                        this._pesquisaService.getPesquisa(params.pesquisa).subscribe((pesquisa) => {
                            // seta a metatag description
                            this.setaMetatag('description', 'Veja tabelas e gráficos com as pesquisas do IBGE sobre todas as cidades do país. Além disso você pode comparar municípios, ver rankings e séries históricas (pesquisa: ' + pesquisa['nome'] + ' | ' + local + ').');
                            // seta a metatag keywords
                            this.setaMetatag('keywords', 'IBGE,dados,geografia,estatística,cidade,município,país,estado,PIB,IDH,IDEB,população,mapa,censo,pesquisa,ranking,comparar,' + localidade.nome + (localidade.parent ? ',' + localidade.parent.nome : ''));
                        });
                    }
                }
            }
        });
    }

    // seta a metatag, criando-a caso necessário
    private setaMetatag(nome: string, conteudo: string) {
        let metatags = document.getElementsByTagName('head')[0].getElementsByTagName('meta');
        for (let i = 0; i < metatags.length; i++) {
            if (metatags[i]['name'] == nome) {
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
