import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { isBrowser } from 'angular2-universal';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';

import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html'
})
export class GraficoComponent implements OnInit, OnDestroy{
    private _subscription: Subscription;
    @Input() tipo = 'bar'; // bar / line / radar / polarArea / pie / doughnut / bubble
    @Input() stacked = 'false';
    @Input() beginAtZero = 'true';

    constructor(
        private sinteseService: SinteseService,
        private localidadeService: LocalidadeService
    ) {}

    public isBrowser = isBrowser;
    
    datasets = [];
    dataItem = [];
    labelItem = [];
    dataSetItem = [];
    dataSetLabelItem = [];
    labels = [];
    options = {};
    @Input() colors = []; // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];

    plotGrafico = false;

    ngOnInit() {  
        this._subscription = this.localidadeService.selecionada$
            .flatMap(localidade => this.sinteseService.getPesquisa('33',localidade.codigo.toString(), ['29168']))
            .subscribe(dados => {
                 for (let item in dados) {

                    this.labelItem = dados[item].indicador;

                    for (let ano in dados[item].res) {
                        if (dados[item].res.hasOwnProperty(ano) && dados[item].res[ano] !== null) {
                            this.labels.push(ano);
                            this.dataItem.push(dados[item].res[ano]);
                        }
                    }

                    this.dataSetItem.push(this.dataItem);
                    this.dataSetLabelItem.push(this.labelItem);

                    this.datasets.push( { data : this.dataSetItem[item], label : this.dataSetLabelItem[item] } );
                 }
                 this.plotGrafico = true;
            });

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

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}