import { Component, OnInit, OnChanges } from '@angular/core';
import { SinteseService } from '../../sintese/sintese.service';
import { RouterParamsService } from '../../shared/router-params.service';
import {slugify} from '../../utils/slug';

@Component({
    selector: 'pesquisa-submenu',
    templateUrl: 'pesquisa-submenu.template.html',
    styleUrls: ['pesquisa-submenu.style.css']
})
export class PesquisaSubmenuComponent {
    
    public pesquisas = [];
    public idPesquisaSelecionada;
    public baseURL;
    public indicadores = [];

    constructor(
        private _routerParams:RouterParamsService,
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

        this._routerParams.params$.subscribe((params) => {
            this.idPesquisaSelecionada = params.pesquisa;
            
            //carrega indicadores que aparecem no submenu
            this._sintese.getNomesPesquisa(params.pesquisa).subscribe((indicadores) => {
                this.indicadores = [];
                for(var i = 0; i < indicadores.length; i++){
                    this.indicadores.push({'nome' : indicadores[i].indicador, 'id' : indicadores[i].id});
                }
                this.indicadores.sort((a, b) => {
                    //usando slugify para remover acentuação, pois letras acentuadas ficam por último, prejudicando o sorting
                    a = slugify(a.nome);
                    b = slugify(b.nome);
                    if (a < b) {return -1;}
                    if (a > b) {return 1;}
                    return 0;
                });
            });

            if(params.uf && params.municipio){
                this.baseURL = '/brasil/' + params.uf + '/' + params.municipio + '/pesquisas/';
            }else if(params.uf){
                this.baseURL = '/brasil/' + params.uf + '/pesquisas/';
            }else{
                this.baseURL = '/brasil/pesquisas/';
            }
        });
    }
}