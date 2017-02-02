import { Component, OnInit, OnChanges } from '@angular/core';
import { SinteseService } from '../sintese/sintese.service';
import { RouterParamsService } from '../shared/router-params.service';
import {slugify} from '../utils/slug';

@Component({
    selector: 'pesquisa',
    templateUrl: 'pesquisa.template.html',
    styleUrls: ['pesquisa.style.css']
})
export class PesquisaComponent {
    
    public pesquisas = [];
    public idPesquisaSelecionada;
    public baseURL;
    public indicadores = [];
    public idIndicadorSelecionado;
    public subIndicadores = [];

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
            this.idIndicadorSelecionado = params.indicador;
            
            //carrega indicadores que aparecem no submenu e nos dados
            this.indicadores = [];
            this.subIndicadores = [];
            this._sintese.getNomesPesquisa(params.pesquisa).subscribe((indicadores) => {
                var indicadoresFlat = [];
                var flat = (item, nivel) => {
                    indicadoresFlat.push({'nome' : item.indicador, 'id' : item.id, 'nivel' : nivel});
                    if(item.children && ((nivel == 0 && item.id == this.idIndicadorSelecionado) || nivel > 0)){
                        for(let i = 0; i < item.children.length; i++){
                            flat(item.children[i], nivel + 1);
                        }
                    }
                }
                for(let i = 0; i < indicadores.length; i++){
                    flat(indicadores[i], 0);
                }
                this.indicadores = indicadoresFlat;

                // for(var i = 0; i < indicadores.length; i++){
                //     this.indicadores.push({'nome' : indicadores[i].indicador, 'id' : indicadores[i].id});
                    
                //     //carrega subindicadores que aparecem no combobox
                //     if(indicadores[i].id == this.idIndicadorSelecionado){
                //         console.log(indicadores[i]);
                //         for(var j = 0; j < indicadores[i].children.length; j++){
                //             this.subIndicadores.push({'nome' : indicadores[i].children[j].indicador, 'id' : indicadores[i].children[j].id});
                //         }
                //         console.log(this.subIndicadores);
                //     }
                // }
                // this.indicadores.sort((a, b) => {
                //     //usando slugify para remover acentuação, pois letras acentuadas ficam por último, prejudicando o sorting
                //     a = slugify(a.nome);
                //     b = slugify(b.nome);
                //     if (a < b) {return -1;}
                //     if (a > b) {return 1;}
                //     return 0;
                // });
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