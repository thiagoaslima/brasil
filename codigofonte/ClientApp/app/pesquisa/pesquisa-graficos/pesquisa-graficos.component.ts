import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IndicadorService3 } from '../../shared3/services';
import { Observable } from 'rxjs/Rx';

import { LinhaTempo } from '../../infografia/linha-tempo/linha-tempo.component';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb.component';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { ResultadoService3 } from '../../shared3/services/resultado.service';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';

@Component({
    selector: 'pesquisa-graficos',
    templateUrl: './pesquisa-graficos.template.html',
    styleUrls: ['./pesquisa-graficos.style.css']
})

export class PesquisaGraficosComponent implements OnInit, OnChanges {

    @Input() localidades;
    @Input() indicadores;
    @Input() indicadorSelecionado;
    @Input() pesquisa;
    @Input() breadcrumb;

    @Output() onAno = new EventEmitter;
    
    public indicador;

    public mapas: {mun, resultados}[] = [];

    public mun;

    public resultados;
    public tituloCartograma;

    public listaPeriodos
    public indexSelecionado;
    public anoSelecionado;

    public eixo;
    public dados;

    public colors = {
        bar: [{ backgroundColor: '#6BC9C7' }, { backgroundColor: '#F7931E' }, { backgroundColor: '#9F55A3' }, { backgroundColor: '#8CC63F' }],
        horizontalBar: [{ backgroundColor: '#6BC9C7' }, { backgroundColor: '#F7931E' }, { backgroundColor: '#9F55A3' }, { backgroundColor: '#8CC63F' }],
        line: [{
            borderColor: '#6BC9C7',
            pointBackgroundColor: '#6BC9C7',
            pointBorderColor: '#6BC9C7',
        }, {
            borderColor: '#F7931E',
            pointBackgroundColor: '#F7931E',
            pointBorderColor: '#F7931E',
        }, {
            borderColor: '#9F55A3',
            pointBackgroundColor: '#9F55A3',
            pointBorderColor: '#9F55A3',
        }, {
            borderColor: '#8CC63F',
            pointBackgroundColor: '#8CC63F',
            pointBorderColor: '#fff',
        }]
    }

    constructor(
        private _localidadeServ: LocalidadeService2,
        private _resultadoServ: ResultadoService3,
        private _pesquisaService: PesquisaService2,
        private _indicadorServ: IndicadorService3,
        private _routerParamsService: RouterParamsService
    ) { }

    ngOnInit() {

        this._routerParamsService.params$.subscribe((params) => {
            this._pesquisaService.getPesquisa(params.params.pesquisa).subscribe((pesquisa) => {
                this.pesquisa = pesquisa;
                this.listaPeriodos = pesquisa.periodos.slice(0).reverse();

                if(params.queryParams.ano){
                    this.anoSelecionado = params.queryParams.ano;
                }
                else {
                    // Quando não houver um período selecionado, é exibido o período mais recente
                    this.anoSelecionado = Number(this.pesquisa.periodos.sort((a, b) =>  a.nome > b.nome ? 1 : -1 )[(this.pesquisa.periodos.length - 1)].nome);
                }

            });
        });

        if(this.localidades && this.localidades.length > 0) {
            this.mapas = [];
            this.atualizaGraficos();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.localidades && this.localidades.length > 0) {
            this.atualizaGraficos();
        }

        if(this.pesquisa) {
            this.listaPeriodos = this.pesquisa.periodos.map((periodo) => {
                return parseInt(periodo.nome);
            });

            if(this.anoSelecionado) {
                this.indexSelecionado = this.listaPeriodos.findIndex((periodo) => periodo == this.anoSelecionado);
            } else {
                this.indexSelecionado = this.listaPeriodos.length - 1;
            }

        }
    }

    atualizaGraficos() {
        if(this.indicadorSelecionado === undefined) {
            return;
        }
        this._resultadoServ.getResultadosCompletos(this.indicadorSelecionado, this.localidades)
            .subscribe((resultados) => {
                this.eixo = resultados[0].periodos.slice();
                this.eixo.reverse();
                this.dados = resultados.map(resultado => {
                    let data = resultado.valores.slice();
                    data.reverse();
                    return {
                        data: data,
                        label: resultado.codigoLocalidade
                    }
                })
            });

    }

    mudaAno(ano){
        this.anoSelecionado = ano;
        this.onAno.emit(ano);
        console.log(ano);
    }
}