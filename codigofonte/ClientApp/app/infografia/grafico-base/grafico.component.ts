import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChange,
    ViewChild
} from '@angular/core';

import { CommonService } from '../../shared';
import { dicionarioTiposGrafico, TiposGrafico } from './grafico.values';

const FileSaver = require('file-saver');

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html',
    styleUrls: ['grafico.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraficoComponent implements OnInit, OnChanges {

    /** VALORES **/
    public tipoGrafico: string = 'bar'
    @Input('tipo') set tipo(tipo: string) {
        this.tipoGrafico = dicionarioTiposGrafico[tipo] || 'bar';
    }
    @Input() titulo: string = '';
    @Input('eixo') labelsEixoX: string[] = [];
    @Input() dados: Array<{ data: number[], label: string }> = [];
    // :  | Array<{ data: number[], label: string }>

    @Input() link: string = null;

    /** CONFIGURAÇÃO **/
    @Input('mostrar-legenda') mostrarLegenda: boolean = false;
    @Input('posicao-legenda') posicaoLegenda: string = 'top';
    @Input('zero-na-origem') comecaNoZero: boolean = true;

    /** ELEMENTO **/
    @ViewChild("grafico") graficoRef: ElementRef;
    @Input() largura = 510;
    @Input() altura = 220;

    @Input() colors = {
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

    imageData = "";

    public options = {
        legend: {
            display: false,
            position: 'top'
        },
        tooltips: {
            enabled: true,
            mode: 'label',
            callbacks: {
                label: function(tooltipItems, data) { 
                    let label;
                    if(parseInt(tooltipItems.yLabel) >= 1000){
                        label = tooltipItems.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    } else {
                        label = tooltipItems.yLabel;
                    }

                    return data.datasets[tooltipItems.datasetIndex].label +': ' + label;
                }
            }
        },
        hover: {
            mode: 'label'
        },
        scales: {
            yAxes: [{
                stacked: false,
                ticks: { 
                    beginAtZero: true,
                    callback: function(value, index, values) {

                        return formatarNumero(value);
                    }
                }
            }],
            xAxes: [{
                stacked: false
            }]
        }
    };;

    constructor(
        private _commonService?: CommonService,
        // options = {} as { legend: any, scales: any, colors: any },
    ) {
        // let { legend, scales, colors } = options;
        // if (legend) { Object.assign(this.options, legend) }
        // if (scales) { Object.assign(this.options, scales) }
        // if (colors) { Object.assign(this.options, colors) }
    }

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

        this.removerBGColorGraficoLinha();

        if (changes.hasOwnProperty('tipo') && changes.tipo.currentValue) {
            switch (changes.tipo.currentValue) {
                case 'barraJustaposta':
                    this.options.scales.xAxes[0].stacked = true;
                    break;

                case 'colunaEmpilhada':
                    this.options.scales.yAxes[0].stacked = true;
                    break;

                default:
                    this.options.scales.xAxes[0].stacked = false;
                    this.options.scales.yAxes[0].stacked = false;
            }
        }

        if (changes.hasOwnProperty('posicaoLegenda') && changes.posicaoLegenda.currentValue) {
            this.options.legend.position = changes.posicaoLegenda.currentValue;
        }

        if (changes.hasOwnProperty('mostrarLegenda')) {
            this.options.legend.display = changes.mostrarLegenda.currentValue;
        }
    }

    setColors(colors: { [tipoGrafico: string]: any }) {
        Object.assign(this.colors, colors);
    }
    isValid() {
        return this.tipoGrafico && this.dados && this.dados.length > 0;
    }

    isLoading() {
        return !this.isValid();
    }

    private removerBGColorGraficoLinha(){

        if(this.dados){

            this.dados = this.dados.map(res => {

                res['fill'] = false;

                return res;
            });
        }
    }

    public download(){
        let blob;
        let canvas = this.graficoRef.nativeElement;

        //baixa a imagem
        if(canvas.msToBlob){
            //IE 11 hack
            blob = canvas.msToBlob();
            FileSaver.saveAs(blob, "grafico.png");
        }else{
            this.imageData = canvas.toDataURL('image/png');
        }

        //baixa o csv
        let csv = '"Nome"';
        for(let i = 0; i < this.labelsEixoX.length; i++){
            csv += ',"' + this.labelsEixoX[i] + '"';
        }
        csv += "\r\n";
        for(let i = 0; i < this.dados.length; i++){
            csv += '"' + this.dados[i].label + '"';
            for(let j = 0; j < this.dados[i].data.length; j++){
                csv += "," + this.dados[i].data[j];
            }
            csv += "\r\n";
        }
        blob = new Blob([csv], { type: "text/csv" });
        FileSaver.saveAs(blob, "grafico.csv");
    }

}

function formatarNumero(valor): string {        

    if(isNaN(valor)){

        return;
    }

    let numeroFormatado = valor.toString();

    // verifica se é decimal
    if(valor % 1 != 0){

        numeroFormatado = valor.toFixed(2);
    }

    // Formatar separador de milhar
    if(valor > 1000){

        numeroFormatado = numeroFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return numeroFormatado;
}