import { Component, OnChanges, Input } from '@angular/core';

import { EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { SinteseService } from '../../sintese/sintese.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

@Component({
    selector: 'pesquisa-tabela',
    templateUrl: './pesquisa-tabela.template.html',
    styleUrls: ['./pesquisa-tabela.style.css']
})

export class PesquisaTabelaComponent implements OnChanges {
   
    @Input() localidades: number[];
    @Input() pesquisa: Pesquisa;
    @Input() posicaoIndicador: string;
    @Input() periodo: string;
   
    private indicadores;



    constructor(
        private _sintese:SinteseService,
        private _localidade:LocalidadeService2
    ) {  }


    ngOnChanges() {

        if(!!this.pesquisa && !!this.localidades && this.localidades.length > 0){

            // debugger;

            // Quando não houver um período selecionado, é exibido o período mais recente
            if(!this.periodo){

                this.periodo = this.pesquisa.periodos.sort((a, b) =>  a.nome > b.nome ? 1 : -1 )[(this.pesquisa.periodos.length - 1)].nome;
            }

            if(!this.posicaoIndicador){

                this.posicaoIndicador = "1";
            }

            let localidadeA = this.localidades[0];
            let localidadeB =  this.localidades.length > 1 ? this.localidades[1] : null;
            let localidadeC = this.localidades.length > 2 ? this.localidades[2] : null;

            this._sintese.getPesquisaLocalidades(this.pesquisa.id, localidadeA, localidadeB, localidadeC, this.posicaoIndicador, EscopoIndicadores.arvore).subscribe((indicadores) => {

                this.indicadores = this.flat(indicadores).map(indicador => {

                    indicador.nivel = this.getNivelIndicador(indicador.posicao);
                    indicador.visivel = indicador.nivel <= 4 ? true : false;

                    return indicador;
                });
            });

        }
    }

    private isFolha(indicador){

        return !indicador.children || indicador.children.length == 0;
    }

    //chamada quando abre os nós nível 2 da tabela de dados
    private controlarExibicao(item){

        // debugger;

        if(item.nivel < 3) {

            return;
        }
        
        this.flat(item.children).map(child => child.visivel = !child.visivel);
    }

    private isListaAberta(indicador){

        return !!indicador.children && indicador.children.length > 0 && indicador.children[0].visivel;
    }

    /** 
     * Função que transforma a árvore num array linear.
     */
    private flat(item){

        let flatItem = [];

        if(item.length){ //é um array
            
            for(let i = 0; i < item.length; i++){
                
                flatItem = flatItem.concat(this.flat(item[i]));
            }

        } else if(item.children){//é um item

            flatItem.push(item);

            for(let i = 0; i < item.children.length; i++){

                flatItem = flatItem.concat(this.flat(item.children[i]));
            }

        }

        return flatItem;
    }


    private getNivelIndicador(posicaoIndicador) {

        let char = '.';

        return posicaoIndicador.split('').reduce((acc, ch) => ch === char ? acc + 1: acc, 2);
    }


    private getStyleClass(posicaoIndicador){
        

        return "nivel-" + this.getNivelIndicador(posicaoIndicador);
    }

    public downloadCSV(){
        let ind = this.indicadores;
        let localidadeA = this._localidade.getMunicipioByCodigo(this.localidades[0]).nome;
        let localidadeB = this.localidades[1] ? this._localidade.getMunicipioByCodigo(this.localidades[1]).nome : '';
        let localidadeC = this.localidades[2] ? this._localidade.getMunicipioByCodigo(this.localidades[2]).nome : '';
        let csv = "Nível;Indicador;" + localidadeA + ';' + localidadeB + ';' + localidadeC + ';Unidade\n' ;
        for(let i = 0; i < ind.length; i++){
            csv += ind[i].posicao + ';' + ind[i].indicador + ';';
            csv += (ind[i].localidadeA && ind[i].localidadeA[this.periodo] ? ind[i].localidadeA[this.periodo] : "") + ';';
            csv += (ind[i].localidadeB && ind[i].localidadeB[this.periodo] ? ind[i].localidadeB[this.periodo] : "") + ';';
            csv += (ind[i].localidadeC && ind[i].localidadeC[this.periodo] ? ind[i].localidadeC[this.periodo] : "") + ';';
            csv += (ind[i].unidade ? ind[i].unidade.id : '') + '\n';
        }
        let blob = new Blob([csv], { type: 'text/csv' });
        FileSaver.saveAs(blob, this.pesquisa.nome + '(' + this.periodo + ').csv');
    }
}