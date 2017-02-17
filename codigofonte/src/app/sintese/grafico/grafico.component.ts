import { Component, Input, Output, OnInit, OnChanges, ViewChild, ElementRef, Renderer, EventEmitter } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { Observable, Observer } from 'rxjs';

import { CommonService } from '../../shared/common.service';

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
    public colors = []; // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];

    private stacked = 'false';
    private beginAtZero = 'true';
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

    }

    private converterParaNumero(valor: string): number{

        return !!valor? Number(valor.replace(',', '.')) : Number(valor)
    }

}