import { Component } from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Component({
    selector: 'sintese-grafico',
    templateUrl: 'sintese-grafico.template.html'
})
export class SinteseGraficoComponent {

    public isBrowser = isBrowser;
    
    private datasets = [];
    private labels = [];
    private options = {};
    private colors = [];

    ngOnInit(changes: any) { 
        this.datasets = [
            { 
                data : [38,41,35,40],
                label : '0 a 14 anos' 
            }, 
            { 
                data : [55,39,50,51],
                label : '15 a 64 anos' 
            }, 
            { 
                data : [7,20,15,9], 
                label : '65 anos ou mais (idosos)' 
            }
        ];

        this.colors = [
            {backgroundColor:'rgba(221,0,0,0.8)'},
            {backgroundColor:'rgba(242,146,32,0.8)'},
            {backgroundColor:'rgba(67,101,176,0.8)'}
            ];

        this.labels = ["1980", "1991", "2000", "2010"];

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