import { Component, OnInit, OnChanges, Input} from '@angular/core';
import { SinteseService } from '../../sintese/sintese.service';
import { RouterParamsService } from '../../shared/router-params.service';
import {slugify} from '../../utils/slug';

@Component({
    selector: 'pesquisa-submenu',
    templateUrl: 'pesquisa-submenu.template.html',
    styleUrls: ['pesquisa-submenu.style.css']
})
export class PesquisaSubmenuComponent {
    
    @Input() pesquisas;
    @Input() indicadores;
    @Input() idPesquisaSelecionada;
    @Input() idIndicadorSelecionado;
    @Input() baseURL;

}