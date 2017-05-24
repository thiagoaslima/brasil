import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, ViewChild } from '@angular/core';

import { CommonService } from '../../shared/common.service';
import { dicionarioTiposGrafico, TiposGrafico } from './grafico.values';

const _defaultColors = {
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
    }]
}

const _defaultOptions = {
    legend: {
        display: true,
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
@Component({
    selector: 'grafico2',
    templateUrl: 'grafico2.template.html',
    styleUrls: ['grafico.style.css']
})
export class Grafico2Component implements OnInit, OnChanges {

    static setColors(obj: { [tipo: string]: any }): void {
        Object.assign(_defaultColors, obj);
    }
    static getColors() {
        return Object.assign({}, _defaultColors);
    }

    static setOptions(obj): void {
        Object.assign(_defaultOptions, obj);
    }

    static getOptions() {
        return Object.assign({}, _defaultOptions);
    }

    /** VALORES **/
    public tipoGrafico: string = 'bar'
    @Input('tipo') set tipo(tipo: string) {
        this.tipoGrafico = dicionarioTiposGrafico[tipo] || 'bar';
    }
    @Input() titulo: string;
    @Input('eixo-x') labelsEixoX: string[];
    @Input() dados: number[] | Array<{ data: number[], label: string }>

    /** CONFIGURAÇÃO **/
    @Input('mostrar-legenda') mostrarLegenda: boolean
    @Input('posicao-legenda') posicaoLegenda: string
    @Input('zero-na-origem') comecaNoZero: boolean

    /** ELEMENTO **/
    @ViewChild("grafico") graficoRef: ElementRef;
    @Input() largura = 510;
    @Input() altura = 220;

    private _colors = Grafico2Component.getColors();
    private _options = Grafico2Component.getOptions();

    constructor(
        private _commonService?: CommonService
    ) { }

    ngOnInit() {
        if (this._commonService) {
            this._commonService.notifyObservable$.subscribe((mensagem) => {
                if (mensagem['tipo'] == 'getDataUrl') {
                    // Envia por serviço a imagem do gráfico em base64
                    this._commonService.notifyOther({ "tipo": "dataURL", "url": this.graficoRef.nativeElement.toDataURL() });
                }
            });
        }
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.hasOwnProperty('tipo') && changes.tipo.currentValue) {
            switch(changes.tipo.currentValue) {
                case 'barraJustaposta':
                    this._options.scales.xAxes[0].stacked = true;
                    break;

                case 'colunaEmpilhada':
                    this._options.scales.yAxes[0].stacked = true;
                    break;

                default:
                    this._options.scales.xAxes[0].stacked = false;
                    this._options.scales.yAxes[0].stacked = false;
            }
        }

        if (changes.hasOwnProperty('posicaoLegenda') && changes.posicaoLegenda.currentValue) {
            this._options.legend.position = changes.posicaoLegenda.currentValue;
        }

        if (changes.hasOwnProperty('mostrarLegenda') && changes.mostrarLegenda.currentValue) {
            this._options.legend.display = changes.mostrarLegenda.currentValue;
        }
    }

    setColors(colors: { [tipoGrafico: string]: any }) {
        Object.assign(this._colors, colors);
    }
    getColors(tipo) {
        return Object.assign({}, this._colors[tipo]);
    }

    getOptions() {
        return Object.assign({}, this._options);
    }

    isValid() {
        return this.tipo && this.dados && this.dados.length > 0;
    }

    isLoading(){
        return !this.isValid();
    }

}