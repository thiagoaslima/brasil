import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { SinteseService } from '../sintese/sintese.service';

import { Localidade } from '../shared2/localidade/localidade.model';
import { Pesquisa } from '../shared2/pesquisa/pesquisa.model';
import { EscopoIndicadores, Indicador } from '../shared2/indicador/indicador.model'

import { RouterParamsService } from '../shared/router-params.service';
import { LocalidadeService2 } from '../shared2/localidade/localidade.service';
import { PesquisaService2 } from '../shared2/pesquisa/pesquisa.service';
import { IndicadorService2 } from '../shared2/indicador/indicador.service';

import { flatTree } from '../utils/flatFunctions';

@Component({
    selector: 'pesquisa',
    templateUrl: './pesquisa.template.html',
    styleUrls: ['./pesquisa.style.css']
})

export class PesquisaComponent implements OnInit {
    @ViewChild('dados') dados: ElementRef;

    localidade: Localidade;

    posicaoIndicador: string = "2";
    localidades: number[] = [null, null, null];
    periodo: string;
    tipo: string;

    indicador;
    indicadores;

    isOcultarValoresVazios = true;
    
    
    public pesquisa;
    public listaPeriodos = [1991, 2000, 2010];
    public anoSelecionado = 0;

    constructor(
        private _routerParams: RouterParamsService,
        private _localidadeService2: LocalidadeService2,
        private _pesquisaService: PesquisaService2,
        private _sintese: SinteseService,
        private _indicadorService: IndicadorService2
    ) { }

    ngOnInit() {

        this._routerParams.params$.subscribe(urlParams => {
            if (urlParams.queryParams['indicador']) {
                this.indicador = parseInt(urlParams.queryParams['indicador']);
            }
            if(!!urlParams.params['indicador']){
                this._indicadorService.getIndicadoresById(Number(urlParams.params['pesquisa']), Number(urlParams.params['indicador']), EscopoIndicadores.filhos)
                    .subscribe((indicadores) => {
                        this.indicadores = indicadores;

                        if(!!indicadores && indicadores.length > 0){ 
                            this.indicador = this.indicador || indicadores[0].id;
                            this.posicaoIndicador = indicadores[0].posicao;
                        }
                        else {
                            this.posicaoIndicador = "2";
                        }
                    });
            }
            if(!!urlParams.params['pesquisa']) {
                this._pesquisaService.getPesquisa(urlParams.params['pesquisa'])
                    .subscribe((pesquisa) => {
                        this.pesquisa = pesquisa;
                    });
            }

            // Obter localidade principal
            this.localidades[0] = (this._localidadeService2.getMunicipioBySlug(urlParams.params['uf'], urlParams.params['municipio'])).codigo;

            // Obter localidades de comparação
            this.localidades[1] = urlParams.queryParams['localidade1'];
            this.localidades[2] = urlParams.queryParams['localidade2'];

            this.localidades = this.localidades.slice(0);

            // Obter período de análise
            this.periodo = urlParams.queryParams['ano'];

            // Obtém o tipo de resultado a ser exibido
            this.tipo = !!urlParams.queryParams['tipo'] ? urlParams.queryParams['tipo'] : 'tabela';

        });

    }

    ocultarValoresVazios(event) {
        this.isOcultarValoresVazios = event['OcultarValoresVazios'];
    }
}