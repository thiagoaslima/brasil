import { Component, OnInit } from '@angular/core';
import { Pesquisa} from '../shared2/pesquisa/pesquisa.model';
import { PesquisaService2 } from '../shared2/pesquisa/pesquisa.service';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'pesquisa',
    templateUrl: './pesquisa.template.html',
    styleUrls: ['./pesquisa.style.css']
})

export class PesquisaComponent2 implements OnInit {
    pesquisa$: Observable<Pesquisa>;

    constructor(
        private _pesquisaService: PesquisaService2
    ) { }

    ngOnInit() {
        this.pesquisa$ = this._pesquisaService.getPesquisa(23);
    }
}