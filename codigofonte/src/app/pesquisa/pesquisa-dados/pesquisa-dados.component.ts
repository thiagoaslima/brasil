import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
    selector: 'pesquisa-dados',
    templateUrl: 'pesquisa-dados.template.html',
    styleUrls: ['pesquisa-dados.style.css']
})

export class PesquisaDadosComponent {
    @Input() indicadores;

    ngOnChanges(){
        let indicadoresFiltrados = [];
        for(let i = 0; i < this.indicadores.length; i++){
            if(this.indicadores[i].nivel > 1){
                indicadoresFiltrados.push(this.indicadores[i]);
            }
        }
        this.indicadores = indicadoresFiltrados;
    }
}