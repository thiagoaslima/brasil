import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

import { EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { SinteseService } from '../../sintese/sintese.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';
import { RouterParamsService } from '../../shared/router-params.service';


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
    private isVazio;

    constructor(
        // TODO: Retirar SinteseService e usar PesquisaService e/ou IndicadrService
        private _sintese:SinteseService,
        private _localidade:LocalidadeService2,
        private _routerParamsService: RouterParamsService,
        private _indicadorService: IndicadorService2,
        private _localidadeService2: LocalidadeService2,
        private _router: Router,
        private _route: ActivatedRoute,
        private _pesquisaService: PesquisaService2
    ) {  }

    ngOnChanges() {
        if(this.pesquisa && this.localidades && this.localidades.length > 0){
            this.indicadores = null;
            let subscription$$ = this._sintese.getPesquisaLocalidades(this.pesquisa['id'], this.localidades[0], this.localidades[1], this.localidades[2], this.posicaoIndicador, EscopoIndicadores.arvore).subscribe((indicadores) => {
                this.indicadores = this.flat(indicadores);
                this.isVazio = true;
                //cria algumas propriedades nos indicadores para contralor sua exibição/interação
                for(let i = 0; i < this.indicadores.length; i++){
                    let indicador = this.indicadores[i];
                    indicador.nivel = this.getNivelIndicador(indicador.posicao);
                    indicador.visivel = indicador.nivel <= 4 || (indicador.parent && indicador.parent.visivel && !this.hasValue(indicador.parent, this.periodo)) ? true : false;
                    indicador.isVazio = !this.hasAnyValue(indicador, this.periodo);
                    if(!indicador.isVazio) //tem algo para mostrar
                        this.isVazio = false;
                }
                subscription$$.unsubscribe();
            });
        }
    }

    private isFolha(indicador){
        return !indicador.children || indicador.children.length == 0 || (this.isOcultarValoresVazios && !this.childrenHasValue(indicador));
    }

    private hasValue(indicador, periodo){
        if((indicador.localidadeA && this.isValor(indicador.localidadeA[periodo])) ||
            (indicador.localidadeB && this.isValor(indicador.localidadeB[periodo])) ||
            (indicador.localidadeC && this.isValor(indicador.localidadeC[periodo])))
            return true;
        else
            return false;
    }

    private hasAnyValue(indicador, periodo){
        if((indicador.localidadeA && this.isValor(indicador.localidadeA[periodo])) ||
            (indicador.localidadeB && this.isValor(indicador.localidadeB[periodo])) ||
            (indicador.localidadeC && this.isValor(indicador.localidadeC[periodo])))
            return true;
        if(indicador.children){
            for(let i = 0; i < indicador.children.length; i++)
                if(this.hasAnyValue(indicador.children[i], periodo))
                    return true;
        }
        return false;
    }

    private childrenHasValue(indicador){
        if(indicador.children){
            for(let i = 0; i < indicador.children.length; i++)
                if(!indicador.children[i].isVazio)
                    return true;
        }
        return false;
    }

    private isValor(valor){
        if(valor == undefined ||
            valor == null ||
            valor.trim() == '99999999999999' ||
            valor.trim() == '99999999999998' ||
            valor.trim() == '99999999999997' ||
            valor.trim() == '99999999999996' ||
            valor.trim() == '99999999999995' ||
            valor.trim() == '99999999999992' ||
            valor.trim() == '99999999999991' ||
            valor.trim() == '-' ||
            valor.trim().toLowerCase() == 'x' ||
            valor.trim() == 'Não existente')
            return false;
        else
            return true;
    }

    //chamada quando abre os nós nível 2 da tabela de dados
    private controlarExibicao(item){
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
                item.children[i]['parent'] = item;
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
        let localidadeB = !!this.localidades[1] && this.localidades[1] != 0 ? this._localidade.getMunicipioByCodigo(this.localidades[1]).nome : '';
        let localidadeC = !!this.localidades[2] && this.localidades[2] != 0 ? this._localidade.getMunicipioByCodigo(this.localidades[2]).nome : '';
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
        for(let i = 0; i < this.pesquisa['periodos'].length; i++){
            if(this.pesquisa['periodos'][i].nome == this.periodo){
                csv += '\n';
                let notas = this.pesquisa['periodos'][i].notas;
                for(let j = 0; j < notas.length; j++){
                    csv += 'Nota: ' + notas[j];
                    csv += '\n';
                }
                csv += '\n';
                let fontes = this.pesquisa['periodos'][i].fontes;
                for(let j = 0; j < fontes.length; j++){
                    csv += 'Fonte: ' + fontes[j];
                    csv += '\n';
                }
            }
        }
        //baixa o arquivo
        let blob = new Blob([csv], { type: 'text/csv' });
        FileSaver.saveAs(blob, this.pesquisa['nome'] + '(' + this.periodo + ').csv');
    }
}