import { Component, Input, Output, OnInit, OnChanges, ViewChild, ElementRef, Renderer, SimpleChange, SimpleChanges } from '@angular/core';
import { isBrowser } from 'angular2-universal';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { Indicador } from '../../shared2/indicador/indicador.model';
import { Resultado } from '../../shared2/resultado/resultado.model';
import { CommonService } from '../../shared/common.service';
import { flat } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/mergeMap';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
// var FileSaver = require('file-saver');

const dicionarioTiposGrafico = {
    "coluna": 'bar',
    "colunaEmpilhada": 'bar',
    "barra": 'horizontalBar',
    "barraJustaposta": 'horizontalBar',
    "linha": 'line',
    "radar": 'radar',
    "polar": 'polarArea',
    "pizza": 'pie',
    "rosca": 'doughnut',
    "pontos": 'bubble'
}

export const TiposGrafico = {
    "coluna": "coluna",
    "colunaEmpilhada": "colunaEmpilhada",
    "barra": "barra",
    "barraJustaposta": "barraJustaposta",
    "linha": "linha",
    "radar": "radar",
    "polar": "polar",
    "pizza": "pizza",
    "rosca": "rosca",
    "pontos": "pontos"
}

const Actions = {
    'MOSTRAR_LEGENDA': 'MOSTRAR_LEGENDA',
    'ESCONDER_LEGENDA': 'ESCONDER_LEGENDA',
    'MUDAR_POSICAO_LEGENDA': 'MUDAR_POSICAO_LEGENDA',
    'EIXO_ZERO': 'EIXO_ZERO',
    'JUSTAPOR_DADOS': 'JUSTAPOR_DADOS',
    'EMPILHAR_DADOS': 'EMPILHAR_DADOS',
    'SEPARAR_DADOS': 'SEPARAR_DADOS'
}

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html',
    styleUrls: ['grafico.style.css']
})
export class GraficoComponent implements OnInit, OnChanges {
    @Input() tipoGrafico: 'bar' | 'horizontalBar' | 'line' | 'radar' | 'polarArea' | 'pie' | 'doughnut' | 'bubble' = 'bar';
    @Input() indicadores: Indicador[] = [];
    @Input() localidade: Localidade;
    @ViewChild("grafico") graficoRef: ElementRef;

    /** OPTIONS **/
    @Input('periodos-validos') mostrarApenasPeriodosValidos = true;
    @Input('mostrar-legenda') mostrarLegenda = true;
    @Input('posicao-legenda') posicaoLegenda = 'top';
    @Input('ponto-zero') comecaNoZero = true;


    // public datasets = [];
    // public labels = [];
    // public options = {};
    public tipo = 'bar';
    public colors = {
        bar: [{ backgroundColor: '#00A99D' }, { backgroundColor: '#177437' }, { backgroundColor: '#22B573' }, { backgroundColor: '#8CC63F' }],
        horizontalBar: [{ backgroundColor: '#00A99D' }, { backgroundColor: '#177437' }, { backgroundColor: '#22B573' }, { backgroundColor: '#8CC63F' }],
        line: [{
            borderColor: '#00A99D', 
            pointBackgroundColor: '#00A99D',
            pointBorderColor: '#fff',
        }, {
            borderColor: '#177437', 
            pointBackgroundColor: '#177437',
            pointBorderColor: '#fff',
        }, {
            borderColor: '#22B573', 
            pointBackgroundColor: '#22B573',
            pointBorderColor: '#fff',
        }, {
            borderColor: '#8CC63F', 
            pointBackgroundColor: '#8CC63F',
            pointBorderColor: '#fff',
        }],
    };
    // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];
    // public carregando: boolean = true;

    public labels$: Observable<string[]>;
    public datasets$: Observable<{ data: number[], label: string }[]>;

    private _indicadores$ = new BehaviorSubject<{ indicador: Indicador, indicadorId: number, pesquisaId: number }[]>([]);
    private _localidade$ = new BehaviorSubject<Localidade>(null);

    // private _showLegend = false;
    // private _legendPosition = 'top';
    // private _stacked = false;
    // private _beginAtZero = true;
    private _graficoRef$: Observable<ElementRef>;

    private _defaultOptions = {
        legend: {
            display: false,
            position: 'top'
        },
        scales: {
            yAxes: [{
                stacked: false,
                ticks: { beginAtZero: true }
            }],
            xAxes: [{
                stacked: false
            }]
        }
    };

    actions$ = new BehaviorSubject<{ action: string, value?: any }>({ action: 'START' });
    options$;

    constructor(
        private _render: Renderer,
        private _commonService: CommonService
    ) {
        const resultados$ = this._indicadores$
            .combineLatest(this._localidade$)
            .filter(([indicadores, localidade]) => Boolean(localidade) && Boolean(indicadores.length))
            .mergeMap(([indicadores, localidade]) => {
                const _indicadores = indicadores.map(item => item.indicador).filter(Boolean)
                return Observable.zip(..._indicadores.map(indicador => indicador.getResultadoByLocal(localidade.codigo)))
            })
            // .do(_ => this.carregando = false)
            // .do(console.log.bind(console, 'resultados'))


        this.labels$ = resultados$
            .map(resultados => this.mostrarApenasPeriodosValidos ? resultados[0].periodosValidos : resultados[0].periodos)
            // .do(console.log.bind(console, 'label'));

        this.datasets$ = this._indicadores$
            .zip(resultados$)
            .map(([indicadores, resultados]) => {
                return resultados.map((resultado, idx) => {
                    const valores = this.mostrarApenasPeriodosValidos ? resultado.valoresValidos : resultado.valores;
                    return {
                        data: valores.map(valor => this.converterParaNumero(valor)),
                        label: indicadores[idx].indicador.nome
                    }
                })
            })
            .distinctUntilChanged((newValue, oldValue) => {
                return newValue['data']
                    .map((val, idx) => [val, oldValue['data'][idx]])
                    .every(item => item[0] === item[1]);
            });

        this.options$ = this.actions$
            // .do(console.log.bind(console, 'options'))
            .scan((state, action) => {
                let legend, position, scales, yAxes, xAxes;

                switch (action.action) {
                    case Actions.MOSTRAR_LEGENDA:
                        legend = Object.assign({}, state.legend, { display: action.value });
                        return Object.assign({}, state, { legend });

                    case Actions.MUDAR_POSICAO_LEGENDA:
                        legend = Object.assign({}, state.legend, { position: action.value });
                        return Object.assign({}, state, { legend });

                    case Actions.EIXO_ZERO:
                        yAxes = [Object.assign({}, state.scales.yAxes[0], { ticks: { beginAtZero: action.value } })];
                        scales = Object.assign({}, state, { yAxes });
                        return Object.assign({}, state, { scales });

                    case Actions.EMPILHAR_DADOS:
                        yAxes = [Object.assign({}, state.scales.yAxes[0], { stacked: true })];
                        scales = Object.assign({}, state, { yAxes });
                        return Object.assign({}, state, { scales });

                    case Actions.JUSTAPOR_DADOS:
                        xAxes = [Object.assign({}, state.scales.xAxes[0], { stacked: true })];
                        scales = Object.assign({}, state, { xAxes });
                        return Object.assign({}, state, { scales });

                    case Actions.SEPARAR_DADOS:
                        yAxes = [Object.assign({}, state.scales.yAxes[0], { stacked: false })];
                        xAxes = [Object.assign({}, state.scales.xAxes[0], { stacked: false })];
                        scales = Object.assign({}, state, { xAxes, yAxes });
                        return Object.assign({}, state, { scales });

                    default:
                        return state;
                }
            }, this._defaultOptions);

    }

    ngOnInit() {

        this._commonService.notifyObservable$.subscribe((mensagem) => {

            if (mensagem['tipo'] == 'getDataUrl') {

                // Envia por serviço a imagem do gráfico em base64
                this._commonService.notifyOther({ "tipo": "dataURL", "url": this.graficoRef.nativeElement.toDataURL() });
            }
        });

        this.actions$.next({ action: 'START' });
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.indicadores && Boolean(changes.indicadores.currentValue)) {
            this._indicadores$.next(changes.indicadores.currentValue);
        }

        if (changes.localidade && Boolean(changes.localidade.currentValue)) {
            this._localidade$.next(changes.localidade.currentValue);
        }

        if (changes.tipoGrafico && changes.tipoGrafico.currentValue) {
            this.tipo = dicionarioTiposGrafico[changes.tipoGrafico.currentValue];

            if (changes.tipoGrafico.currentValue === 'barraJustaposta') {
                this.actions$.next({ action: Actions.JUSTAPOR_DADOS });
            }
            else if (changes.tipoGrafico.currentValue === 'colunaEmpilhada') {
                this.actions$.next({ action: Actions.EMPILHAR_DADOS });
            }
            else {
                this.actions$.next({ action: Actions.SEPARAR_DADOS });
            }
        }

        if (changes.posicaoLegenda && changes.posicaoLegenda.currentValue) {
            this.actions$.next({ action: Actions.MUDAR_POSICAO_LEGENDA, value: changes.posicaoLegenda.currentValue });
        }

        if (changes.mostrarLegenda) {
            this.actions$.next({ action: Actions.MOSTRAR_LEGENDA, value: changes.mostrarLegenda.currentValue });
        }
    }


    /*
    private plotChart(dados, nomeSerie, tipoGrafico) {

        this.labels = []; //anos

        this.tipo = tipoGrafico; //bar

        let dadosGrafico: string[] = [];
        let dataset = {};
        let i = 0;

        //construindo os datasets
        for (var indicador in dados) {

            //limpa valores para gerar o dataset de cada indicador e joga-los no array datasets
            dataset = {};
            dadosGrafico = [];

            for (var periodo in dados[indicador]) {

                dadosGrafico.push(dados[indicador][periodo]);
                //puxa os períodos do primeiro indicador
                i === 0 ? this.labels.push(periodo) : '';

            }

            //converte os valores finais para números antes de jogar no dataset
            let valores = dadosGrafico.map(valor => {
                return this.converterParaNumero(valor);
            });

            dataset = { backgroundColor: this.colors[i], data: valores, label: nomeSerie[i] };
            this.datasets.push(dataset);
            i++;
        }

        this.options = {
            legend: {
                display: this._showLegend,
                position: this._legendPosition
            },
            scales: {
                yAxes: [{
                    stacked: this._stacked,
                    ticks: { beginAtZero: this._beginAtZero }
                }],
                xAxes: [{
                    stacked: this._stacked
                }]
            }
        };

    }
    */

    private converterParaNumero(valor: string): number {

        return !!valor ? Number(valor.replace(',', '.')) : Number(valor)
    }

}