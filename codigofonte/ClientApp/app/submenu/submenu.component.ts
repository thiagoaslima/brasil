import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { SinteseService } from '../sintese/sintese.service';
import { PesquisaService } from '../shared/pesquisa/pesquisa.service.2';
import { RouterParamsService } from '../shared/router-params.service';
import { slugify } from '../utils/slug';
import { LocalidadeService } from '../shared/localidade/localidade.service';

@Component({
    selector: 'submenu',
    templateUrl: 'submenu.template.html',
    styleUrls: ['submenu.style.css']
})
export class SubmenuComponent {

    public pesquisas = [];
    public idPesquisaSelecionada;
    public indicadores = [];
    public idIndicadorSelecionado;
    public codigoMunicipio;
    public baseURL;

    @Output() closeMenu = new EventEmitter();

    constructor(
        private _routerParams:RouterParamsService,
        private _sintese:SinteseService,
        private _localidade:LocalidadeService,
        private _pesquisa:PesquisaService
    ){}

    ngOnInit(){

        //busca pesquisas disponíveis e as organiza em ordem alfabética
        this._sintese.getPesquisasDisponiveis().subscribe((pesquisas) => {
            pesquisas.sort((a, b) => {
                //usando slugify para remover acentuação, pois letras acentuadas ficam por último, prejudicando o sorting
                let _a = slugify(a.descricao);
                let _b = slugify(b.descricao);
                if (_a < _b) {return -1;}
                if (_a > _b) {return 1;}
                return 0;
            });
            this.pesquisas = pesquisas;
        });
        
        //pega a rota atual
        this._routerParams.params$.subscribe(({params}) => {
            //Pega o código do município apontado pela rota. O código deve possuir somente 6 dígitos, sendo o último desprezado
            let dadosMunicipio = this._localidade.getMunicipioBySlug(params.uf, params.municipio);
            this.codigoMunicipio = dadosMunicipio.codigo.toString().substr(0, 6);

            //pega o indicador e a pesquisa a partir da rota
            this.idPesquisaSelecionada = params.pesquisa;
            this.idIndicadorSelecionado = params.indicador;

            //this._sintese.getPesquisa(params.pesquisa, this.codigoMunicipio).subscribe((indicadores) => {
            this._pesquisa.getFilhosIndicador(params.pesquisa, 0).subscribe((indicadores) => {
                let ind = []
                for(let i = 0; i < indicadores.length; i++){
                    ind.push({indicador : indicadores[i].indicador, id : indicadores[i].id});
                }
                for(let i = 0; i < this.pesquisas.length; i++){                   
                    if(this.pesquisas[i].id == this.idPesquisaSelecionada){
                        this.pesquisas[i].indicadores = ind;
                        this.pesquisas[i].visivel = true;
                    }else{
                        this.pesquisas[i].indicadores = undefined;
                        this.pesquisas[i].visivel = false;
                    }
                }
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

    onClick(index){
        this.pesquisas[index].visivel = !this.pesquisas[index].visivel;
        //carrega indicadores que aparecem no submenu
        if(this.pesquisas[index].indicadores == undefined){
            //this._sintese.getPesquisa(this.pesquisas[index].id, this.codigoMunicipio).subscribe((indicadores) => {
            this._pesquisa.getFilhosIndicador(this.pesquisas[index].id, 0).subscribe((indicadores) => {
                let ind = [];
                for(let i = 0; i < indicadores.length; i++){
                    ind.push({indicador : indicadores[i].indicador, id : indicadores[i].id});
                }
                this.pesquisas[index].indicadores = ind;
            });
        }
    }

}