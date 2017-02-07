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
    
    public pesquisas = [];
    public idPesquisaSelecionada;
    public baseURL;
    public indicadores = [];
    public idIndicadorSelecionado;
    public codigoMunicipio;

    constructor(
        private _routerParams:RouterParamsService,
        private _sintese:SinteseService,
        private _localidade:LocalidadeService
    ){}

    ngOnInit(){
        //busca pesquisas disponíveis
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

        //pega a rota atual
        this._routerParams.params$.subscribe((params) => {
            //Pega o código do município apontado pela rota. O código deve possuir somente 6 dígitos, sendo o último desprezado
            let dadosMunicipio = this._localidade.getMunicipioBySlug(params.uf, params.municipio);
            this.codigoMunicipio = dadosMunicipio.codigo.toString().substr(0, 6);

            //pega o indicador e a pesquisa a partir da rota
            this.idPesquisaSelecionada = params.pesquisa;
            this.idIndicadorSelecionado = params.indicador;
            
            //carrega indicadores que aparecem no submenu e nos dados
            this.indicadores = [];
            //this._sintese.getNomesPesquisa(params.pesquisa).subscribe((indicadores) => {
            this._sintese.getPesquisa(params.pesquisa, this.codigoMunicipio).subscribe((indicadores) => {
                for(let i = 0; i < indicadores.length; i++){
                    if(indicadores[i].id != this.idIndicadorSelecionado){
                        indicadores[i].children = []; //mantem só os filhos do indicador selecionado
                    }
                }
                this.indicadores = indicadores;
            });

            //seta a variável de rota base
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