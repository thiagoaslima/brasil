import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/combineLatest';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { Localidade } from '../../shared/localidade/localidade.interface';
import { RouterParamsService } from '../../shared/router-params.service';


@Component({
    selector: 'sintese-detalhes',
    templateUrl: 'sintese-detalhes.template.html',
    styleUrls: ['sintese-detalhes.style.css']
})
export class SinteseDetalhesComponent implements OnInit, OnDestroy {

    constructor(
        private _route: ActivatedRoute,
        private _sinteseService: SinteseService,
        private _localidadeService: LocalidadeService,
        private _params: RouterParamsService
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
    public dados;
    public dadosMapa;
    public codigoLocalidade: number;

    private _localidadeSubscription: Subscription;

    ngOnInit() {
        const componentes = {
            "mapa": "cartograma",
            "grafico": "grafico",
            "fotos": "fotos",
            "default": "grafico"
        };

        this._localidadeSubscription = this._params.params$
            .combineLatest(this._localidadeService.selecionada$)
            // .distinctUntilChanged()
            .subscribe(([{ params, queryParams }, localidade]) => {
                let indicador = params && params['indicador'];
                let view = queryParams && queryParams['v'];

                console.log(params, queryParams);

                if (indicador == 'historico') {
                    this.componenteAtivo = 'historico';
                    return;
                }

                this.componenteAtivo = componentes[view] || componentes.default;

                if (indicador && this.componenteAtivo === "cartograma") {
                    this.exibirMapa(localidade, params);
                }

                if (indicador && this.componenteAtivo === "grafico") {
                    this.exibirGrafico(localidade, indicador);
                }
            });
    }

    ngOnDestroy() {
        this._localidadeSubscription.unsubscribe();
    }

    public exibirComponente(nomeComponente) {

        this.componenteAtivo = nomeComponente;
    }

    public setDataURL(dataURL) {

        this.urlDownloadImagemGrafico = dataURL;
    }

    private exibirMapa(localidade: Localidade, params: Params) {

        this.codigoLocalidade = localidade.codigo;
        this.obterDadosMapa(localidade, params);

    }

    private exibirGrafico(localidade: Localidade, indicadorId) {
        this.isGraficoCarregando = true;

        let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(indicadorId).codigo.toString();
        let indicador$ = this._sinteseService.getPesquisa(codigoPesquisa, localidade.codigo.toString(), [indicadorId]);
        let infoPesquisa$ = this._sinteseService.getInfoPesquisa(codigoPesquisa);

        indicador$.subscribe(valores => {
            let multiplicador = (valores.length && valores[0].unidade && valores[0].unidade.multiplicador && Number(valores[0].unidade.multiplicador) > 0 ? 'x' + valores[0].unidade.multiplicador + ' ' : '');

            this.dadosIndicador = !!valores[0] ? valores[0].res : '{}';
            this.tipoGrafico = this.getTipoGraficoIndicador(valores[0].id);
            this.nomeIndicador = valores[0].indicador + (!!valores[0].unidade ? ' (' + multiplicador + valores[0].unidade.id + ')' : '');
            // this.notasIndicador = !!valores[0] ? valores[0].nota : '{}';
            // this.fontesIndicador = !!valores[0] ? valores[0].fonte : '{}';

            this.isGraficoCarregando = false;
        });

        infoPesquisa$.subscribe(info => {

            this.fontesIndicador = !!info.periodos ? info.periodos : [];
            info.periodos.forEach(periodo => {
                this.temFonte = periodo.fonte.length > 0 ? true : false;
                this.temNota = periodo.nota.length > 0 ? true : false;
            });
        });

    }

    private obterDadosMapa(localidade, params) {

        //DADOS PARA O MAPA COROPLÉTICO
        let uf = this._localidadeService.getUfBySigla(params['uf'])
        let municipios = `${uf.codigo.toString()}xxxx`;
        let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo.toString();

        this._sinteseService.getDadosPesquisaMapa(codigoPesquisa, [municipios], params['indicador'])
            .map((indicador: any[]) => {
                return indicador[0].res.map((obj) => {
                    let dados = !!obj ? obj.res : '[]';

                    return dados.map((dado) => {
                        let dadosMunic = { munic: dado.localidade, anos: [], valores: [], faixa: '' };// [{munic:'330455',anos:['2010','2016'], valores:['3252215',null], faixa:'faixa2'}]

        let localidades;
        if (params['municipio']) {
            localidades = `${uf.codigo.toString()}xxxx`;   
        } else {
            localidades = `${uf.codigo.toString().charAt(0)}x`;   
        }
         
        let codigoPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params['indicador']).codigo.toString();

        //  this.dadosMapa = this._sinteseService.getDadosPesquisaMapa(codigoPesquisa, [localidades], params['indicador'])
        //     .map((indicador: any[]) => {
        //         return indicador[0].res.map((dados) => (
        //             {
        //                 munic: dados.localidade,
        //                 anos: Object.keys(dados.res),
        //                 valores: Object.keys(dados.res).map(periodo => dados.res[periodo]),
        //                 faixa: ''
        //             }
        //         ));
        //     });

        this.dados = this._sinteseService.getDadosPesquisaMapa(codigoPesquisa, [localidades], params['indicador'])
            .map((resultadosParent: any[]) => {
                const resultados = resultadosParent[0].res;

                /* Os períodos são padrão para todas as localidades, permitindo que se selecione qualquer uma para obter o dado */
                let periodos = Object.keys(resultados[0].res);
                let localidades = resultados.reduce( (agg, resultado) => Object.assign(agg, {[resultado.localidade]: Object.keys(resultado.res).map(periodo => resultado.res[periodo])}), Object.create(null));

                return {
                    periodos,
                    resultados
                };
            });
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