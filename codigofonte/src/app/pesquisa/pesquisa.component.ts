import { Component, OnInit, OnChanges } from '@angular/core';
import { SinteseService } from '../sintese/sintese.service';
import { RouterParamsService } from '../shared/router-params.service';
import { slugify } from '../utils/slug';
import { LocalidadeService } from '../shared/localidade/localidade.service';

@Component({
    selector: 'pesquisa',
    templateUrl: 'pesquisa.template.html',
    styleUrls: ['pesquisa.style.css']
})
export class PesquisaComponent {
    
}