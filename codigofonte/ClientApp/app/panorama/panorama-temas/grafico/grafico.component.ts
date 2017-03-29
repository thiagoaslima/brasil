import { Component, Input, Output, OnInit, OnChanges, ViewChild, ElementRef, Renderer, EventEmitter } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { Observable, Observer } from 'rxjs';

import { CommonService } from '../../../shared/common.service';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html',
    styleUrls: ['grafico.style.css']
})
export class GraficoComponent implements OnInit, OnChanges{

    @Input() tipoGrafico: string;
    @Input() dadosIndicador: string[];
    @Input() nomeSerie: string = 'Indicador';
    @Input() carregando: boolean = true;

    @Output() dataURL = new EventEmitter();

    @ViewChild("grafico1") graficoRef : ElementRef;
  
    public isBrowser = isBrowser;
    
    public datasets = [];
    public labels = [];
    public options = {};
    public tipo = 'bar'; // bar / line / radar / polarArea / pie / doughnut / bubble
    public colors = ["#00A99D", "#177437", "#22B573", "#8CC63F"]; // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];

    private showLegend = false;
    private legendPosition = 'top';
    private stacked = false;
    private beginAtZero = true;
    private graficoRef$: Observable<ElementRef>;
    
    constructor( 
        private _render: Renderer, 
        private _commonService: CommonService
    ){ }

    ngOnInit(){

        this._commonService.notifyObservable$.subscribe((mensagem) => {

            if(mensagem['tipo'] == 'getDataUrl'){

                // Envia por serviço a imagem do gráfico em base64
                this._commonService.notifyOther({"tipo": "dataURL", "url": this.graficoRef.nativeElement.toDataURL()});
            }
        });
    }

    ngOnChanges(){

        this.plotChart(this.dadosIndicador, this.nomeSerie, this.tipoGrafico);
    }


    private plotChart(dados, nomeSerie, tipoGrafico){
        
        this.labels = []; //anos

        this.tipo = tipoGrafico; //bar

        let dadosGrafico:string[] = [];
        let dataset = {};
        let i = 0;

        for(var indicador in dados) {

            dataset = {};
            dadosGrafico = [];
            for(var periodo in dados[indicador]) {

                dadosGrafico.push(dados[indicador][periodo]);
                i === 0 ? this.labels.push(periodo) : '';

            }

            let valores = dadosGrafico.map(valor => {
                return this.converterParaNumero(valor);
            });

            dataset = {backgroundColor: this.colors[i], data: valores, label: nomeSerie[i]};
            this.datasets.push(dataset);
            i++;
        }
            
        this.options = {
            legend:{
                display: this.showLegend,
                position: this.legendPosition
            },
            scales: {
                yAxes: [{
                    stacked: this.stacked,
                    ticks: { beginAtZero:this.beginAtZero }
                }],
                xAxes: [{
                    stacked: this.stacked
                }]
            }
        };

    }

    private converterParaNumero(valor: string): number{

        return !!valor? Number(valor.replace(',', '.')) : Number(valor)
    }

}