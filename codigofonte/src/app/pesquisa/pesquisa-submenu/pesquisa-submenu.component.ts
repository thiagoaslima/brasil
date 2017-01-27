import { Component, OnInit, OnChanges } from '@angular/core';
import { SinteseService } from '../../sintese/sintese.service';
import {slugify} from '../../utils/slug';

@Component({
    selector: 'pesquisa-submenu',
    templateUrl: 'pesquisa-submenu.template.html',
    styleUrls: ['pesquisa-submenu.style.css']
})
export class PesquisaSubmenuComponent {
    
    public pesquisas = [];

    constructor(
        private _sintese:SinteseService
    ){}

    ngOnInit(){
        this._sintese.getPesquisasDisponiveis().subscribe((pesquisas) => {
            pesquisas.sort((a, b) => {
                //usando slugify para remover acentuação, pois letras acentuadas ficam por último, prejudicando o sorting
                a = slugify(a.descricao);
                b = slugify(b.descricao);
                if (a < b) {return -1;}
                if (a > b) {return 1;}
                return 0;
            });
            this.pesquisas = pesquisas;
        });
    }
}