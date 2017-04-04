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
   
    @Input() localidades: Localidade[];
    @Input() pesquisa: Pesquisa;
    @Input() periodo: string;
   
    private indicadores;



    constructor( private _sintese:SinteseService ) {  }


    ngOnChanges() {

        if(!!this.pesquisa && !!this.localidades && this.localidades.length > 0 && !!this.periodo){

            let localidadeA = this.localidades[0].codigo;
            let localidadeB =  this.localidades.length > 1 ? this.localidades[1].codigo : null;
            let localidadeC = this.localidades.length > 2 ? this.localidades[2].codigo : null;

            this._sintese.getPesquisaLocalidades(this.pesquisa.id, localidadeA, localidadeB, localidadeC).subscribe((indicadores) => {

                this.indicadores = this.flat(indicadores);
            });

        }
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