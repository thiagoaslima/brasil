import { Component, Input, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { isBrowser } from 'angular2-universal';

import { SinteseService } from '../sintese.service';
import { CommonService } from '../../shared/common.service';

import { Observable, Subscription } from 'rxjs';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html'
})
export class GraficoComponent implements OnInit, OnChanges, OnDestroy{

    @ViewChild("grafico1") graficoRef : ElementRef;
  
    public isBrowser = isBrowser;
    
    public datasets = [];
    public labels;
    public options = {};

    @Input() dados = [];
    @Input() tipo = 'bar'; // bar / line / radar / polarArea / pie / doughnut / bubble
    @Input() nomeSerie = 'indicador';
    @Input() private colors = []; // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];
    @Input() private stacked = 'false';
    @Input() private beginAtZero = 'true';

    private _subscription: Subscription;
    
    
    constructor( 
        private _commonService: CommonService,
        private _render: Renderer 
    ){ }

    ngOnInit() {  

        
        this.labels = null;
        this.labels = [];

        this._subscription = this._commonService.notifyObservable$.subscribe((res) => {

            if (res.hasOwnProperty('option')) {

                if(res.option === 'getDataURL'){

                    this._commonService.notifyOther({option: 'dataURL', url: this.graficoRef.nativeElement.toDataURL()});
                }
            }

        });

        this.plotChart();
    }

    ngOnChanges(changes){


        this.labels = null;
        this.labels = [];


        this.plotChart();
    }

    ngOnDestroy() {

        this._subscription.unsubscribe();
    }

    private plotChart(){

        let dadosGrafico:string[] = [];
        for(var i in this.dados) {

            dadosGrafico.push(this.dados[i]);
            this.labels.push(i);
        }

        let valores = dadosGrafico.map(valor => {

            return !!valor? Number(valor.replace(',', '.')) : Number(valor);
        });

        this.datasets = [{data: valores, label: this.nomeSerie}];
        
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

}