import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'linha-tempo',
    templateUrl: 'linha-tempo.template.html',
    styleUrls: ['linha-tempo.style.css']
})
export class LinhaTempo implements OnInit, OnChanges {

    @Input() anos : Number[];
    @Input() indexSelecionado;

    @Output() onAno = new EventEmitter();

    ngOnChanges(){
    }

    ngOnInit(){

    }

    onSelect(index){
        this.indexSelecionado = index;
        this.onAno.emit(this.anos[index]);
    }

}

