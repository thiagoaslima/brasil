import { Component, Input, Output, OnChanges, ViewChild, ElementRef, Renderer, EventEmitter } from '@angular/core';
import { isBrowser } from 'angular2-universal';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html'
})
export class GraficoComponent implements OnChanges{

    @Input() tipoGrafico: string;
    @Input() dadosIndicador: string[];
    @Input() nomeSerie: string = 'Indicador';

    @Output() dataURL = new EventEmitter();

    @ViewChild("grafico1") graficoRef : ElementRef;
  
    public isBrowser = isBrowser;
    
    public datasets = [];
    public labels = [];
    public options = {};
    public tipo = 'bar'; // bar / line / radar / polarArea / pie / doughnut / bubble
    public colors = []; // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];

    private stacked = 'false';
    private beginAtZero = 'true';
    
    constructor( 
        private _render: Renderer 
    ){ }

    ngOnChanges(){

        if (!!this.dadosIndicador && !!this.nomeSerie && !!this.tipoGrafico) {
            
            this.plotChart(this.dadosIndicador, this.nomeSerie, this.tipoGrafico);
        }
    }

    private plotChart(dados, nomeSerie, tipoGrafico){
        
        this.labels = [];

        this.tipo = tipoGrafico;

        let dadosGrafico:string[] = [];
        for(var i in dados) {

            dadosGrafico.push(dados[i]);
            this.labels.push(i);
        }

        let valores = dadosGrafico.map(valor => {

            return this.converterParaNumero(valor);
        });
        
        this.datasets = [{data: valores, label: nomeSerie, lineTension: 0}];

        
        this.options = {
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

        //this.graficoRef.nativeElement.toDataURL()
    }

    private converterParaNumero(valor: string): number{

        return !!valor? Number(valor.replace(',', '.')) : Number(valor)
    }

}