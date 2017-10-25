import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isBrowser } from 'angular2-universal';

import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { ModalErrorService } from '../modal-erro/modal-erro.service';

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
        private _route: ActivatedRoute,
        private modalErrorService: ModalErrorService
    ) { }

    ngOnInit() {
        this._routerParamsService.params$.subscribe(({ params, queryParams }) => {
            if (isBrowser && window) {
                let titulo = 'IBGE | Brasil em Síntese | ';
                let localidade =params.municipio
                    ? this._localidadeService.getMunicipioBySlug(params.uf, params.municipio)
                    : params.uf
                        ? this._localidadeService.getUfBySigla(params.uf)
                        : this._localidadeService.getRoot();

                if (localidade) {
                    if (localidade.tipo === 'municipio') {
                        // concatena nome da uf e do município
                        titulo += localidade.parent.nome + ' | ' + localidade.nome;
                    } else {
                        // concatena nome da uf ou 'Brasil'
                        titulo += localidade.nome;
                    }
                }

                let url = window.location.href;

                if (url.indexOf('panorama') >= 0) {
                    titulo += ' | Panorama';
                    document.title = titulo; // titulo panorama
                } else if (url.indexOf('historico') >= 0) {
                    titulo += ' | História & Fotos';
                    document.title = titulo; // titulo histórico
                } else if (url.indexOf('pesquisa') >= 0) {
                    titulo += ' | Pesquisa';

                    if (params.pesquisa) {
                        this._pesquisaService.getPesquisa(params.pesquisa).subscribe((pesquisa) => {

                            // Caso seja a pequisa MUNIC, é necessário informar um período para obter os indicadores, pois os indicadores variam por período.
                            let periodoMaisrecente = null;
                            if (pesquisa.id === 1) {

                                periodoMaisrecente = pesquisa.periodos.sort( (periodoA, periodoB) => periodoA.nome < periodoB.nome ? 1 : -1)[0];
                            }

                            pesquisa.getIndicadores(periodoMaisrecente.nome).subscribe((indicadores) => {
                                let indicadorNome = indicadores.length > 0 ? indicadores[0].nome : '';

                                for (let i = 0; i < indicadores.length; i++) {
                                    if (indicadores[i].id === params.indicador) {
                                        indicadorNome = indicadores[i].nome;
                                    }
                                }
                                titulo += ' | ' + pesquisa.nome + ' | ' + indicadorNome;

                                if (queryParams.ano) {
                                    titulo += ' | ' + queryParams.ano;
                                }

                                document.title = titulo; // titulo pesquisa
                            },
                            error => this.modalErrorService.showError());
                        });
                    }
                }
            }
        },
        error => this.modalErrorService.showError());
    }
}