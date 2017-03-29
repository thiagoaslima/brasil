import { Component, OnInit } from '@angular/core';
import { Pesquisa} from '../shared2/pesquisa/pesquisa.model';
import { PesquisaService2 } from '../shared2/pesquisa/pesquisa.service';
import { Localidade} from '../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../shared2/localidade/localidade.service';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'pesquisa',
    templateUrl: './pesquisa.template.html',
    styleUrls: ['./pesquisa.style.css']
})

export class PesquisaComponent2 implements OnInit {
    pesquisa$: Observable<Pesquisa>;
    localidade: Localidade;

    constructor(
        private _pesquisaService: PesquisaService2,
        private _localidadeService: LocalidadeService2
    ) { }

    ngOnInit() {
        //pegar dados da rota em app-state, tanto da pesquisa quanto da localidade
        this.pesquisa$ = this._pesquisaService.getPesquisa(22);
        this.localidade = this._localidadeService.getMunicipioBySlug('rj', 'rio-de-janeiro');
    }
}