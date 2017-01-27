import { Component, Input, OnChanges } from '@angular/core';
import { isBrowser } from 'angular2-universal';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';

import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html'
})
export class GraficoComponent implements OnChanges{

    @Input() dados = [];
    @Input() tipo = 'bar'; // bar / line / radar / polarArea / pie / doughnut / bubble
    @Input() colors = []; // this.colors = [ {backgroundColor:'rgba(221,0,0,0.8)'}, {backgroundColor:'rgba(242,146,32,0.8)'}, {backgroundColor:'rgba(67,101,176,0.8)'} ];
    @Input() stacked = 'false';
    @Input() beginAtZero = 'true';

    public isBrowser = isBrowser;
    
    public datasets = [];
    public labels = [];
    public options = {};
    public plotGrafico = false;

    ngOnChanges() {  

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

            this.plotGrafico = true;
        }

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