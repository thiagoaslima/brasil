import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { Localidade } from '../../shared/localidade/localidade.interface';
import { RouterParamsService } from '../../shared/router-params.service';

@Component({
    selector: 'sintese-detalhes',
    templateUrl: 'sintese-detalhes.template.html',
    styles: ['sintese-detalhes.style.css']
})
export class SinteseDetalhesComponent implements OnInit {

    constructor(
        private _route: ActivatedRoute,
        private _routerParams: RouterParamsService,
        private _sinteseService: SinteseService,
        private _localidadeService: LocalidadeService,
    ) { }

    // Header
    public urlDownloadImagemGrafico;

    // Componente a ser exibido
    public componenteAtivo: string = 'cartograma';

    // Grafico
    public tipoGrafico: string;
    public dadosIndicador: string[];
    public nomeIndicador: string;
    public notasIndicador: string;
    public fontesIndicador: string;
    public isGraficoCarregando: boolean = false;

    // Mapa
    public dadosMapa: any[];
    public codigoLocalidade: number;


    private _localidadeSubscription: Subscription;

    ngOnInit() {

        this._localidadeService.selecionada$
            .subscribe(localidade => {

                this._route.queryParams.subscribe(params => {

                    if (params['v'] == 'mapa') {

                        this.exibirMapa(localidade);
                        this.componenteAtivo = 'cartograma';

                    } else {

                        this.exibirGrafico(localidade);
                        this.componenteAtivo = 'grafico';
                    }

                });
            });
    }

    public exibirComponente(nomeComponente) {

        this.componenteAtivo = nomeComponente;
    }

    public setDataURL(dataURL) {

        //this.urlDownloadImagemGrafico = dataURL;
    }

    private exibirMapa(localidade: Localidade) {

        this.codigoLocalidade = localidade.codigo;
        this.dadosMapa = this.obterDadosMapa();
    }

    private exibirGrafico(localidade: Localidade) {

        this.isGraficoCarregando = true;

        this._route.params.filter(params => !!params['indicador'])
            .switchMap((params: Params) => {

                let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo;
                let indicador = this._sinteseService.getPesquisa(codigoPesquisa, localidade.codigo.toString(), [params['indicador']]);

                return indicador;

            }).subscribe(valores => {

                let multiplicador = (valores[0].unidade && valores[0].unidade.multiplicador && Number(valores[0].unidade.multiplicador) > 0 ? 'x' + valores[0].unidade.multiplicador + ' ' : '');

                this.dadosIndicador = !!valores[0] ? valores[0].res : '{}';
                this.tipoGrafico = this.getTipoGraficoIndicador(valores[0].id);
                this.nomeIndicador = valores[0].indicador + (!!valores[0].unidade ? ' (' + multiplicador + valores[0].unidade.id + ')' : '');
                this.notasIndicador = !!valores[0] ? valores[0].nota : '{}';
                this.fontesIndicador = !!valores[0] ? valores[0].fonte : '{}';

                this.isGraficoCarregando = false;

                console.log(this.dadosIndicador);

            });
    }

    private obterDadosMapa() {

        //DADOS PARA O MAPA COROPLÉTICO
        let dadosMapa = [];

        let dadosOrigem = [
            { "codLocal": "3304557", "2010": null, "2015": null, "2016": "6498837", "2017": null },
            { "codLocal": "3303609", "2010": null, "2015": null, "2016": "8498837", "2017": null },
            { "codLocal": "3303708", "2010": null, "2015": null, "2016": "2498837", "2017": null },
            { "codLocal": "3303807", "2010": null, "2015": null, "2016": "5498837", "2017": null },
            { "codLocal": "3303401", "2010": null, "2015": null, "2016": "3498837", "2017": null },
            { "codLocal": "3303906", "2010": null, "2015": null, "2016": "7498837", "2017": null }
        ];

        dadosOrigem.forEach(dado => {

            let dadosMunic = { munic: '', anos: [], valores: [], faixa: '' };
            dadosMunic.munic = dado.codLocal.substr(0, 6);
            Object.keys(dado).forEach(ano => {
                if (Object.keys(dado).length > dadosMunic.anos.length + 1) {
                    dadosMunic.anos.push(ano);
                    dadosMunic.valores.push(dado[ano]);
                }
            });

            dadosMapa.push(dadosMunic);
        });

        return dadosMapa;
    }

    private getTipoGraficoIndicador(indicador) {

        let tipoGraficoIndicador = {
            30227: 'bar',
            28311: 'bar',
            47001: 'line',
            28160: 'line',
            29168: 'bar',
            29171: 'bar'
        };

        return !!tipoGraficoIndicador[indicador] ? tipoGraficoIndicador[indicador] : 'bar';
    }
}