import { Component, Input, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
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
export class GraficoComponent implements OnChanges{

    @ViewChild("grafico1") graficoRef : ElementRef;

    @Input() dados = [];
    @Input() tipo = 'bar'; // bar / line / radar / polarArea / pie / doughnut / bubble
    @Input() colors = []; // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];
    @Input() stacked = 'false';
    @Input() beginAtZero = 'true';
    
    public isBrowser = isBrowser;
    
    public datasets = [];
    public labels = [];
    public options = {};

    private _subscription: Subscription;


    constructor( private _commonService: CommonService ){ }

    ngOnInit() {

        this._subscription = this._commonService.notifyObservable$.subscribe((res) => {

            if (res.hasOwnProperty('option') && res.option === 'getDataURL') {

                this._commonService.notifyOther({option: 'dataURL', url: this.graficoRef.nativeElement.toDataURL()});
            }
        });
    }

    ngOnDestroy() {

        this._subscription.unsubscribe();
    }

    ngOnChanges() {  

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

        if(!!this.dados){

            let dadosGrafico:string[] = [];
            this.labels = []

            for(var i in this.dados) {

                dadosGrafico.push(this.dados[i]);
                this.labels.push(i);
            }

            let valores = dadosGrafico.map(valor => {

                return !!valor? valor.replace(',', '.') : valor;
            });

            this.datasets = [{data: valores, label: ''}];

            
        }
    }
}