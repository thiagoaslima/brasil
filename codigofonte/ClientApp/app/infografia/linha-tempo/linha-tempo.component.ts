import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'linha-tempo',
    templateUrl: 'linha-tempo.template.html',
    styleUrls: ['linha-tempo.style.css']
})
export class LinhaTempo implements OnInit, OnChanges {

    @Input() anos : Number[];
    @Input() anoSelecionado;

    @Output() onAno = new EventEmitter();

    ngOnChanges(){
    }

    ngOnInit(){

    }

    onSelect(ano){
        this.anoSelecionado = ano;
        this.onAno.emit(ano);
    }

}

