import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';

import { SinteseService } from '../sintese/sintese.service';
import {
    Localidade,
    Pesquisa,
    escopoIndicadores, Indicador,
    RouterParamsService,
    LocalidadeService3,
    PesquisaService3,
    IndicadorService3
} from '../../shared';
import { flatTree } from '../../../utils';
import { ModalErrorService } from '../../core';


@Component({
    selector: 'pesquisa',
    templateUrl: './pesquisa.template.html',
    styleUrls: ['./pesquisa.style.css']
})

export class PesquisaComponent implements OnInit, OnDestroy {
    @ViewChild('dados') dados: ElementRef;

    posicaoIndicador = '2';
    localidades: string[];
    periodo: string;
    tipo: string;

    indicador;
    indicadores;
    pesquisa;
    breadcrumb;

    isOcultarValoresVazios = true;

    private subscription: Subscription;

    constructor(
        private _routerParams: RouterParamsService,
        private _localidadeService2: LocalidadeService3,
        private _pesquisaService: PesquisaService3,
        private _sintese: SinteseService,
        private _indicadorService: IndicadorService3,
        private modalErrorService: ModalErrorService
    ) { }

    ngOnInit() {
        
        this.subscription = this._routerParams.params$.subscribe(urlParams => {
            this._pesquisaService.getPesquisa(parseInt(urlParams.params['pesquisa'])).subscribe((pesquisa) => {

                // Caso seja a pequisa MUNIC, é necessário informar um período para obter os indicadores, pois os indicadores variam por período.
                let periodoMaisrecente = null;
                if (pesquisa.id === 1) {

                    periodoMaisrecente = pesquisa.periodos.sort( (periodoA, periodoB) => periodoA.nome < periodoB.nome ? 1 : -1)[0].nome;
                }                

                this._indicadorService
                .getIndicadoresByIdByLocalidade(Number(urlParams.params['pesquisa']), Number(urlParams.params['indicador']), escopoIndicadores.filhos, null, false, periodoMaisrecente)
                .subscribe((indicadores) => {
                    this.pesquisa = pesquisa;
                    this.localidades = new Array(3);

                    // Obtém localidade principal
                    // Identifica o nível regional da pesquisa, municipal ou estadual:
                    // Municipal
                    if(!!urlParams.params['uf'] && !!urlParams.params['municipio']){
                        
                        this.localidades[0] = (this._localidadeService2.getMunicipioBySlug(urlParams.params['uf'], urlParams.params['municipio'])).codigo.toString();
                    }

                    // Estadual
                    if(!!urlParams.params['uf'] && !urlParams.params['municipio']){

                        this.localidades[0] = (this._localidadeService2.getUfBySigla(urlParams.params['uf'])).codigo.toString();
                    }

                    // Nacional
                    if(!urlParams.params['uf']){

                        this.localidades[0] = this._localidadeService2.getRoot().codigo.toString();
                    }

                    // Obter localidades de comparação
                    this.localidades[1] = urlParams.queryParams['localidade1'];
                    this.localidades[2] = urlParams.queryParams['localidade2'];


                    //indicador usado no ranking/series históricas/graficos
                    if(urlParams.queryParams && urlParams.queryParams['indicador'])
                        this.indicador = parseInt(urlParams.queryParams['indicador']);

                    // Obtém o tipo de resultado a ser exibido
                    this.tipo = !!urlParams.queryParams['tipo'] ? urlParams.queryParams['tipo'] : 'tabela';

                    // Quando não houver um período selecionado, é exibido o período mais recente
                    let periodos = pesquisa['periodos'];
                    if(urlParams.queryParams['ano'])
                        this.periodo = urlParams.queryParams['ano'];
                    else
                        this.periodo = periodos.sort((a, b) =>  a.nome > b.nome ? 1 : -1 )[(periodos.length - 1)].nome;
                    this.indicadores = indicadores;
                    if(parseInt(urlParams.params['pesquisa']) != 23) //23 = censo
                        this.posicaoIndicador = '0';
                    else if(indicadores && indicadores.length > 0)
                        this.posicaoIndicador = indicadores[0]['posicao'];
                    else
                        this.posicaoIndicador = '2';
                },
                error => {
                    console.error(error);
                    this.modalErrorService.showError();
                });
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
            });
        },
        error => {
            console.error(error);
            this.modalErrorService.showError();
        });
    }


    ocultarValoresVazios(event) {
        this.isOcultarValoresVazios = event['OcultarValoresVazios'];
    }

    setaIndicador(indicador){
        this.indicador = indicador;
    }

    setaBreadcrumb(event){
        this.breadcrumb = event;
    }

    ngOnDestroy(){

        this.subscription.unsubscribe();
    }
}