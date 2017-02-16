import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { Localidade } from '../../shared/localidade/localidade.interface';
import { RouterParamsService } from '../../shared/router-params.service';
import { CommonService } from '../../shared/common.service';

@Component({
    selector: 'sintese-detalhes',
    templateUrl: 'sintese-detalhes.template.html',
    styleUrls: ['sintese-detalhes.style.css']
})
export class SinteseDetalhesComponent implements OnInit {

    constructor(
        private _route: ActivatedRoute,
        private _sinteseService: SinteseService,
        private _localidadeService: LocalidadeService,
        private _params: RouterParamsService,
        private _commonService: CommonService
    ) { }

    // Header
    public urlDownloadImagemGrafico;

    // Componente a ser exibido
    public componenteAtivo: string = 'cartograma';

    // Grafico
    public tipoGrafico: string;
    public dadosIndicador: string[];
    public nomeIndicador: string;
    public notasIndicador: string[];
    public fontesIndicador: string[];
    public temFonte: boolean = false;
    public temNota: boolean = false;
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

                    } else if(params['v'] == 'historico') {

                        this.componenteAtivo = 'historico';

                    } else {

                        this.exibirGrafico(localidade);
                        this.componenteAtivo = 'grafico';
                    }

                });
            });

        // Obtém a imagem do gráfico em base64 para download, assim que o gráfico for desenhado.
        // A imagem é recuperada pelo serviço
        this._commonService.notifyObservable$.subscribe((mensagem) => {

            debugger;

            if(mensagem['tipo'] == 'dataURL'){

                debugger;

                this.setDataURL(mensagem['url']);
            }
        });
            
    }

    public exibirComponente(nomeComponente) {

        this.componenteAtivo = nomeComponente;
    }

    public setDataURL(dataURL) {

        this.urlDownloadImagemGrafico = dataURL;
    }

    private exibirMapa(localidade: Localidade) {

        this.codigoLocalidade = localidade.codigo;
        this.obterDadosMapa();

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
                // this.notasIndicador = !!valores[0] ? valores[0].nota : '{}';
                // this.fontesIndicador = !!valores[0] ? valores[0].fonte : '{}';

                this.isGraficoCarregando = false;

                console.log(this.dadosIndicador);

            });

            this._route.params.filter(params => !!params['indicador'])
            .switchMap((params: Params) => {
                let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo;
                let infoPesquisa = this._sinteseService.getInfoPesquisa(codigoPesquisa);
                return infoPesquisa;
            }).subscribe(info => {
                console.log(info);
                //debugger;
                this.fontesIndicador = !!info.periodos ? info.periodos : [];
                info.periodos.forEach(periodo => {
                    this.temFonte = periodo.fonte.length > 0 ? true : false;
                    this.temNota = periodo.nota.length > 0 ? true : false;
                });
            });

    }

    private obterDadosMapa() {

        //DADOS PARA O MAPA COROPLÉTICO
        this._route.params
            .filter(params => !!params['indicador'])
            .switchMap((params: Params) => {
                
                let municipios = this._localidadeService.getUfBySigla(params['uf']).children.map(munic => munic.codigo.toString());
                let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo;
                return this._sinteseService.getDadosPesquisaMapa(codigoPesquisa, municipios, params['indicador']);

            })
            .map((indicador: any[]) => {

                return indicador.map((obj) => {
                    let dados = !!obj ? obj.res : '[]';

                    return dados.map((dado) => {
                        let dadosMunic = { munic: dado.localidade, anos: [], valores: [], faixa: '' };// [{munic:'330455',anos:['2010','2016'], valores:['3252215',null], faixa:'faixa2'}]

                        Object.keys(dado.res).forEach(ano => {
                            dadosMunic.anos.push(ano);
                            dadosMunic.valores.push(dado.res[ano]);
                        });

                        return dadosMunic;
                    });
                });

            })
            .subscribe(arrDados => {

                this.dadosMapa = arrDados[0];

            });
            
            return this.dadosMapa;

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