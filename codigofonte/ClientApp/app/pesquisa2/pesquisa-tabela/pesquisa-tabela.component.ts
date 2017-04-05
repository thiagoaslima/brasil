import { Component, OnChanges, Input } from '@angular/core';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { SinteseService } from '../../sintese/sintese.service';

@Component({
    selector: 'pesquisa-tabela',
    templateUrl: './pesquisa-tabela.template.html',
    styleUrls: ['./pesquisa-tabela.style.css']
})

export class PesquisaTabelaComponent implements OnChanges {
   
    @Input() localidades: number[];
    @Input() pesquisa: Pesquisa;
    @Input() periodo: string;
   
    private indicadores;



    constructor( private _sintese:SinteseService ) {  }


    ngOnChanges() {

        if(!!this.pesquisa && !!this.localidades && this.localidades.length > 0 && !!this.periodo){

            let localidadeA = this.localidades[0];
            let localidadeB =  this.localidades.length > 1 ? this.localidades[1] : null;
            let localidadeC = this.localidades.length > 2 ? this.localidades[2] : null;

            this._sintese.getPesquisaLocalidades(this.pesquisa.id, localidadeA, localidadeB, localidadeC).subscribe((indicadores) => {

                this.indicadores = this.flat(indicadores).map(indicador => {

                    indicador.nivel = this.getNivelIndicador(indicador.posicao);
                    indicador.visivel = indicador.nivel <= 3 ? true : false;

                    return indicador;
                });
            });

        }
    }


    private isFilho(posicaoPai: string, posicaoFilho: string){

        return posicaoFilho.startsWith(posicaoPai);
    }

    private isFolha(indicador){

        return !indicador.children || indicador.children.length == 0;
    }

    //chamada quando abre os nós nível 2 da tabela de dados
    private controlarExibicao(item){

        debugger;

        if(item.nivel < 3) {

            return;
        }
        
        this.flat(item.children).map(child => child.visivel = !child.visivel);
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
}