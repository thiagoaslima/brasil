import { Component, OnInit } from '@angular/core';
import { LocalidadeService } from '../shared/localidade/localidade.service';

@Component({
    selector: 'sintese',
    templateUrl: 'sintese.template.html',
})
export class SinteseComponent implements OnInit {
    
    tipo;

    constructor(
        private _localidade:LocalidadeService
    ){};

    ngOnInit(){
        this._localidade.selecionada$.subscribe((localidade)=>{
            if(localidade.codigo == 0){
                //sintese Brasil
                this.tipo = 1;
            }else if(localidade.codigo > 0 && localidade.codigo < 100){
                //sintese UF
                this.tipo = 2;
            }else{
                //sintese município
                this.tipo = 3;
            }
        });
    }

}