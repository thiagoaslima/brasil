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
                backgroundColor: "#D00",
                data : [38,41,35,40],
                label : '0 a 14 anos' 
            }, 
            { 
                backgroundColor: "#F29220", 
                data : [55,39,50,51],
                label : '15 a 64 anos' 
            }, 
            { 
                backgroundColor: "#4365B0",
                data : [7,20,15,9], 
                label : '65 anos ou mais (idosos)' 
            }
        ];

        this.colors = ["#D00", "#F29220", "#4365B0"];

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