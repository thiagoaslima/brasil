import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';

import { EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { SinteseService } from '../../sintese/sintese.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isBrowser } from 'angular2-universal';


// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

@Component({
    selector: 'pesquisa-indicadores',
    templateUrl: './pesquisa-indicadores.template.html',
    styleUrls: ['./pesquisa-indicadores.style.css']
})

export class PesquisaIndicadoresComponent implements OnChanges {

    @Input() localidades: number[];
    @Input() pesquisa: Pesquisa;
    @Input() posicaoIndicador: string;
    @Input() periodo: string;
    @Input('ocultarValoresVazios') isOcultarValoresVazios: boolean = true; 
   
    @Output() onIndicador = new EventEmitter;
    @Output() onBreadcrumb = new EventEmitter;

    private indicadores;
    private isVazio;
    private indicadorComparacao;

    constructor(
        // TODO: Retirar SinteseService e usar PesquisaService e/ou IndicadrService
        private _sintese:SinteseService,
        private _localidade:LocalidadeService2,
        private _pesquisaService: PesquisaService2,
        private _routerParamsService: RouterParamsService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {  }

    ngOnChanges() {
        if(this.pesquisa && this.localidades && this.localidades.length > 0){
            this.indicadores = null;
            let subscription$$ = this._sintese.getPesquisaLocalidades(this.pesquisa['id'], this.localidades[0], this.localidades[1], this.localidades[2], this.posicaoIndicador, EscopoIndicadores.arvore).subscribe((indicadores) => {
                this.indicadores = this.flat(indicadores);
                this.indicadorComparacao = this.getIndicadorComparacao();
                this.isVazio = true;
                //cria algumas propriedades nos indicadores para contralor sua exibição/interação
                for(let i = 0; i < this.indicadores.length; i++){
                    let indicador = this.indicadores[i];
                    indicador.nivel = this.getNivelIndicador(indicador.posicao);
                    indicador.visivel = indicador.nivel <= 4 || (indicador.parent && indicador.parent.visivel && !this.hasValue(indicador.parent, this.periodo)) ? true : false;
                    indicador.isVazio = !this.hasAnyValue(indicador, this.periodo);
                    if(!indicador.isVazio) //tem algo para mostrar
                        this.isVazio = false;
                    //seta o valor default do indicador de comparação
                    if(this.indicadorComparacao == 0 && this.hasValue(indicador, this.periodo))
                        this.indicadorComparacao = indicador.id;
                    //expande a arvore de indicadores para sempre mostrar o indicador selecionado para comparação
                    if(indicador.id == this.indicadorComparacao){
                        let parent = indicador.parent;
                        let breadcrumb = [{'nome': indicador.indicador, 'id': indicador.id , 'hasValue': this.hasValue(indicador, this.periodo)}];
                        while(parent){
                            breadcrumb.unshift({'nome': parent.indicador, 'id': parent.id , 'hasValue': this.hasValue(parent, this.periodo)});
                            parent.visivel = true;
                            parent.children.map(child => child.visivel = true);
                            parent = parent.parent;
                        }
                        this.onBreadcrumb.emit(breadcrumb);
                    }
                }
                subscription$$.unsubscribe();
                //emite evento com o indicador de comparação
                if(this.getIndicadorComparacao() == 0)
                    this.onIndicador.emit(this.indicadorComparacao);
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

    navegarPara(indicador){
        if (isBrowser) {
            let url = window.location.href;
            let path:any = url.split('?')[0];
            let queryParams = {};
            path = path.split('/');
            path.splice(0, path.indexOf('brasil'));
            if(url.indexOf('?') >= 0){
                let qp:any = url.split('?')[1];
                qp = qp.split('&');
                for(let i = 0; i < qp.length; i++){
                    let keyValue = qp[i].split('=');
                    queryParams[keyValue[0]] = keyValue[1];
                }
                queryParams['indicador'] = indicador;
            }
            //navega para a url
            this._router.navigate(path, {'queryParams' : queryParams});
        }
    }

    getIndicadorComparacao(){
        if (isBrowser) {
            let url = window.location.href;
            if(url.indexOf('?') >= 0){
                let qp:any = url.split('?')[1];
                qp = qp.split('&');
                for(let i = 0; i < qp.length; i++){
                    let keyValue = qp[i].split('=');
                    if(keyValue[0] == 'indicador')
                        return keyValue[1];
                }
            }
        }
        return 0;
    }

}