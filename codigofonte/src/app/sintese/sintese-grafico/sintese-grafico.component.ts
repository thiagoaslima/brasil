import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Component({
    selector: 'sintese-grafico',
    templateUrl: 'sintese-grafico.template.html'
})
export class SinteseGraficoComponent implements OnChanges {

    public isBrowser = isBrowser;
    
    @Input() dados = [];

    public datasets = [];
    public labels;
    public options = {};
    public colors = [];


    ngOnChanges(changes: any) { 

        debugger;

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



        this.colors = [
            {backgroundColor:'rgba(221,0,0,0.8)'},
            {backgroundColor:'rgba(242,146,32,0.8)'},
            {backgroundColor:'rgba(67,101,176,0.8)'}
            ];

        this.options = {
            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    stacked: true
                }]
            },
            legend: {
                display: true,
                //position: 'top',
                horizontalAlign: "left",
                verticalAlign: "center",
                labels: {
                    boxWidth: 30                                
                }
            }//,responsive: false
        };
    }
    

}