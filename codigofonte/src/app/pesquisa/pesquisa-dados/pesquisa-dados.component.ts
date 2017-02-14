import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SinteseService } from '../../sintese/sintese.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { slugify } from '../../utils/slug';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { Router, ActivatedRoute } from '@angular/router';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

@Component({
    selector: 'pesquisa-dados',
    templateUrl: 'pesquisa-dados.template.html',
    styleUrls: ['pesquisa-dados.style.css']
})
export class PesquisaDadosComponent {
    public indicadores;
    public idIndicadorSelecionado;
    public dadosCombo = [];
    public dadosTabela = [];
    public indexCombo = 0;
    public tituloPrincipal = "";
    public anos = [];
    private baseURL = "";
    public aberto = false;
    public ano1 = 0
    public ano2 = 1;

    constructor(
        private _routerParams:RouterParamsService,
        private _sintese:SinteseService,
        private _localidade:LocalidadeService,
        private _route: ActivatedRoute
    ){}

    ngOnInit(){
        //pega a rota atual
        this._routerParams.params$.subscribe((params) => {
            //Pega o código do município apontado pela rota. O código deve possuir somente 6 dígitos, sendo o último desprezado
            let dadosMunicipio = this._localidade.getMunicipioBySlug(params.uf, params.municipio);
            let codigoMunicipio = dadosMunicipio ? (dadosMunicipio.codigo ? dadosMunicipio.codigo.toString().substr(0, 6) : '0') : '0';

            //pega o indicador a partir da rota
            this.idIndicadorSelecionado = params.indicador;
            
            //carrega indicadores que aparecem nos dados
            this._sintese.getPesquisa(params.pesquisa, codigoMunicipio).subscribe((indicadores) => {
                //adiciona 3 novas propriedades aos indicadores: nível e visível
                //nível é usado para aplicar o css para criar a impressão de hierarquia na tabela de dados
                //visível é usado para definir se o indicador está visível ou não (dentro de um elemento pai fechado)
                let ind = this.flat(indicadores);
                this.anos = [];
                for(let i = 0; i < ind.length; i++){
                    ind[i].nivel = ind[i].posicao.split('.').length - 2;
                    ind[i].visivel = ind[i].nivel <= 2 ? true : false;
                    if(ind[i].res){
                        for(let key in ind[i].res){
                            //seta os anos da pesquisa
                            if(this.anos.indexOf(key) < 0)
                                this.anos.push(key);
                        }
                    }
                }
                this.anos.sort((a, b) => {
                    if(a < b) return 1;
                    if(a > b) return -1;
                    return 0;
                });

                this.ano1 = this.anos.length >= 1 ? this.anos[0] : '-1';
                this.ano2 = this.anos.length >= 2 ? this.anos[1] : '-1';

                //seta os dados iniciais do combobox e da tabela de dados
                for(let i = 0; i < indicadores.length; i++){
                    if(indicadores[i].id == this.idIndicadorSelecionado){
                        this.tituloPrincipal = indicadores[i].indicador;
                        this.dadosCombo = indicadores[i].children;
                        if(this.dadosCombo.length > 0){
                            this.dadosTabela = this.flat(this.dadosCombo[0]);
                        }
                    }
                }

                this.indicadores = indicadores;
                //console.log(indicadores);
            });

            //seta a variável de rota base
            if(params.uf && params.municipio){
                this.baseURL = '/brasil/' + params.uf + '/' + params.municipio;
            }else if(params.uf){
                this.baseURL = '/brasil/' + params.uf;
            }else{
                this.baseURL = '/brasil';
            }
        });

        //verifica se o componente de detalhes está aberto (mobile)
        this._route.queryParams.subscribe(params => {
            if(params['detalhes'] == 'true'){
                this.aberto = true;
            }
        });
    }

    //chamada quando muda o combobox
    onChange(event){
        this.indexCombo = event.target.selectedIndex;
        this.dadosTabela = this.flat(this.dadosCombo[this.indexCombo]);
    }

    //chamada quando muda o combobox
    mudaAno1(event){
        this.ano1 = this.anos[event.target.selectedIndex];
    }

    //chamada quando muda o combobox
    mudaAno2(event){
        this.ano2 = this.anos[event.target.selectedIndex];
    }

    //chamada quando abre os nós nível 2 da tabela de dados
    onClick(item){
        if(item.nivel != 2)
            return;
        let children = this.flat(item.children);
        for(let i = 0; i < children.length; i++){
            children[i].visivel = !children[i].visivel;
        }
    }

    //chamada quando se clica no botão de download
    //exporta os dados da tabela para csv
    onDownload(){
        for(let i = 0; i < this.indicadores.length; i++){
            if(this.indicadores[i].id == this.idIndicadorSelecionado){
                let ind = this.flat(this.indicadores[i]);
                let csv = this.baseURL + '\n\n';
                csv += "Nível;Indicador;" +
                    (this.anos.length >= 1 && this.anos[0] != '-' ? this.anos[0] + ';' : '') +
                    (this.anos.length >= 2 && this.anos[1] != '-' ? this.anos[1] + ';' : '') + 'Unidade\n';
                for(let j = 0; j < ind.length; j++){
                    csv += ind[j].posicao + ';' + ind[j].indicador
                    if(ind[j].resultados){
                        for(let k = 0; k < ind[j].resultados.length; k++){
                            if(this.anos.indexOf(ind[j].resultados[k].ano) >= 0){
                                csv += ';' + ind[j].resultados[k].valor;
                            }
                        }
                        csv += ';' + (ind[j].unidade ? ind[j].unidade.id : '');
                    }
                    csv += '\n';
                }
                let blob = new Blob([csv], { type: 'text/csv' });
                FileSaver.saveAs(blob, 'tabela.csv');
                break;
            }
        }
    }

    //essa função dá um flat(transforma a árvore num array linear) na árvore de indicadores
    private flat(item){
        let flatItem = [];
        if(item.length){ //é um array
            for(let i = 0; i < item.length; i++){
                flatItem = flatItem.concat(this.flat(item[i]));
            }
        }else if(item.children){//é um item
            flatItem.push(item);
            for(let i = 0; i < item.children.length; i++){
                flatItem = flatItem.concat(this.flat(item.children[i]));
            }
        }
        return flatItem;
    }
}