import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'breadcrumb',
    templateUrl: 'breadcrumb.template.html',
    styleUrls: ['breadcrumb.style.css']
})
export class Breadcrumb implements OnInit, OnChanges {

    @Input() indicadores; //array linear de indicadores (já com flat aplicado)
    @Input() indicadorSelecionado; // modelo indicador selecionado
    @Input() urlBase = '';

    caminho = [];

    ngOnChanges(){
        this.caminho = [];
        if(this.indicadores){
            for(let i = 0; i < this.indicadores.length; i++){
                if(this.indicadores[i].id == this.indicadorSelecionado.id){
                    let nivel = this.indicadores[i].nivel;
                    this.caminho = [{'nome' : this.indicadores[i].nome, 'id' : this.indicadores[i].id}];
                    for(; i >= 0; i--){
                        if(this.indicadores[i].nivel == nivel - 1){
                            nivel -= 1;
                            this.caminho.unshift({'nome' : this.indicadores[i].indicador, 'id' : this.indicadores[i].id});
                        }
                    }
                    break;
                }
            }
        }
    }

    ngOnInit(){
        
    }

}
