import { Component, OnInit, OnChanges, Input} from '@angular/core';

@Component({
    selector: 'pesquisa-header',
    templateUrl: 'pesquisa-header.template.html',
    styleUrls: ['pesquisa-header.style.css']
})

export class PesquisaHeaderComponent {
    @Input() indicadores;

    ngOnChanges(){
        let indicadoresFiltrados = [];
        for(let i = 0; i < this.indicadores.length; i++){
            if(this.indicadores[i].nivel == 1){
                indicadoresFiltrados.push(this.indicadores[i]);
            }
        }
        this.indicadores = indicadoresFiltrados;
    }

    onChange(event){
        //console.log(event);
    }
}