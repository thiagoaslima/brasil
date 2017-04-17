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
    @Input('ocultarValoresVazios') isOcultarValoresVazios: boolean = true; 
   
    private indicadores;

    constructor(
        // TODO: Retirar SinteseService e usar PesquisaService e/ou IndicadrService
        private _sintese:SinteseService,
        private _localidade:LocalidadeService2
    ) {  }


    ngOnChanges() {

        if(!!this.pesquisa && !!this.localidades && this.localidades.length > 0){

            //organiza os períodos da pesquisa em orderm crescente
            this.pesquisa.periodos.sort((a, b) =>  a.nome > b.nome ? 1 : -1 );

            //valida o período
            let valido = false;
            for(let i = 0; i < this.pesquisa.periodos.length; i++){
                //verifica se o período é válido
                if(this.pesquisa.periodos[i].nome == this.periodo){
                    valido = true;
                    break;
                }
            }
            //se nao for válido, usa o período mais recente
            if(!valido)
                this.periodo = this.pesquisa.periodos[this.pesquisa.periodos.length - 1].nome;

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

                    indicador.isVazio = !this.hasValue(indicador, this.periodo) && !this.hasChildrenWithValue(indicador.children, this.periodo);

                    return indicador;
                });
            });

        }
    }


    private isFolha(indicador){

        return !indicador.children || indicador.children.length == 0;
    }

    private hasValue(indicador, periodo){

        if(!indicador || !periodo || !indicador.localidadeA){

            return false;
        }

        return !this.isEmpty(indicador.localidadeA[periodo]);
    }

    private hasChildrenWithValue(children: any[], periodo){

        if(!children || !periodo){

            return false;
        }

        let hasChildrenWithValue = false;

        for(let i = 0; i < children.length; i++){

            hasChildrenWithValue = this.hasValue(children[i], periodo) || this.hasChildrenWithValue(children[i].children, periodo)

            if(hasChildrenWithValue){
                break;
            }
        }

        return hasChildrenWithValue;
    }

    isEmpty(valor){

        return (!valor || 
                valor.trim() == '99999999999999' ||
                valor.trim() == '99999999999998' ||
                valor.trim() == '99999999999997' ||
                valor.trim() == '99999999999996' ||
                valor.trim() == '99999999999995' ||
                valor.trim() == '99999999999992' ||
                valor.trim() == '99999999999991' ||
                valor.trim() == '-' ||
                valor.trim().toLowerCase() == 'x' ||
                valor.trim() == 'Não existente');
    }

    private ocultarValoresVazios(listaIndicadores){

        // TODO: Ocultar valores vazios
        // Se a opção oultar valores vazios estiver habilitada
        if(this.isOcultarValoresVazios){

            // Se for um nó folha, oculta o nó

            // Se for um nó galho, o oculta caso todos os filhos já sejam ocultos
        }
    }

    //chamada quando abre os nós nível 2 da tabela de dados
    private controlarExibicao(item){

        // debugger;

        if(item.nivel < 3) {

            return;
        }

       
        if(this.isListaAberta(item)) //se estiver aberta
            this.flat(item.children).map(child => child.visivel = false); //fecha os filhos e todos os subfilhos
        else //senão, se estiver fechado
            item.children.map(child => child.visivel = true); //abre apenas os filhos imediatos
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
        //valores dos indicadores
        for(let i = 0; i < ind.length; i++){
            csv += ind[i].posicao + ';' + ind[i].indicador + ';';
            csv += (ind[i].localidadeA && ind[i].localidadeA[this.periodo] ? ind[i].localidadeA[this.periodo] : "") + ';';
            csv += (ind[i].localidadeB && ind[i].localidadeB[this.periodo] ? ind[i].localidadeB[this.periodo] : "") + ';';
            csv += (ind[i].localidadeC && ind[i].localidadeC[this.periodo] ? ind[i].localidadeC[this.periodo] : "") + ';';
            csv += (ind[i].unidade ? ind[i].unidade.id : '') + '\n';
        }
        //fontes e notas
        for(let i = 0; i < this.pesquisa.periodos.length; i++){
            if(this.pesquisa.periodos[i].nome == this.periodo){
                csv += '\n';
                let notas = this.pesquisa.periodos[i].notas;
                for(let j = 0; j < notas.length; j++){
                    csv += 'Nota: ' + notas[j];
                    csv += '\n';
                }
                csv += '\n';
                let fontes = this.pesquisa.periodos[i].fontes;
                for(let j = 0; j < fontes.length; j++){
                    csv += 'Fonte: ' + fontes[j];
                    csv += '\n';
                }
            }
        }
        //baixa o arquivo
        let blob = new Blob([csv], { type: 'text/csv' });
        FileSaver.saveAs(blob, this.pesquisa.nome + '(' + this.periodo + ').csv');
    }
}