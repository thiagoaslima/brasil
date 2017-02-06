import { Component, OnInit, OnChanges, Input} from '@angular/core';
import { SinteseService } from '../../sintese/sintese.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { slugify } from '../../utils/slug';
import { LocalidadeService } from '../../shared/localidade/localidade.service';

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
    @Input() codigoMunicipio;

    constructor(
        private _routerParams:RouterParamsService,
        private _sintese:SinteseService,
        private _localidade:LocalidadeService
    ){}

    onClick(index){
        this._sintese.getPesquisa(this.pesquisas[index].id, this.codigoMunicipio).subscribe((indicadores) => {
            for(let i = 0; i < indicadores.length; i++){
                indicadores[i].children = undefined; //remove os filhos
                indicadores[i].res = undefined; //remove resultados
            }
            for(let i = 0; i < this.pesquisas.length; i++){
                this.pesquisas[i].submenu = undefined; //reseta os submenus
            }
            this.pesquisas[index].submenu = indicadores; //set o submenu visivel
        });
    }
}