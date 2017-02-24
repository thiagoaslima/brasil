import { Component, OnInit, OnChanges } from '@angular/core';
import { SinteseService } from '../sintese/sintese.service';
import { slugify } from '../utils/slug';
import { LocalidadeService } from '../shared/localidade/localidade.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'pesquisa',
    templateUrl: 'pesquisa.template.html',
    styleUrls: ['pesquisa.style.css']
})
export class PesquisaComponent implements OnInit {
    
    public aberto;

    constructor(
        private _route: ActivatedRoute
    ){};

    ngOnInit(){

         //verifica se o componente de detalhes está aberto (mobile)
        this._route.queryParams.subscribe(params => {
            if(params['detalhes'] == 'true'){
                this.aberto = true;
            } else {
                this.aberto = false;
            }
        });

    }
    
}