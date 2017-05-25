import { Ranking } from '../../shared2/indicador/indicador.model';
import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { ItemConfiguracao, ItemTemaView, TEMAS } from "../configuration";
import { Panorama2Service } from '../panorama.service';
import { Localidade, Resultado } from "../../shared3/models";
import { converterObjArrayEmHash } from "../../utils2";

@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html'
})
export class PanoramaTemasComponent implements OnChanges {
    @Input() configuracao: ItemConfiguracao[] = [];
    @Input() localidade: Localidade = null;

    public temas = [] as ItemTemaView[];
    public resultados = {} as {[indicadorId: number]: Resultado};
    public rankings = {} as {[indicadorId: number]: {[contexto: string]: any}};
    private _valores = {};

    constructor (
        private _panoramaService: Panorama2Service
    ) { }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (
            changes.hasOwnProperty('configuracao') && changes.configuracao.currentValue && changes.configuracao.currentValue.length > 0 ||
            changes.hasOwnProperty('localidade') && changes.localidade.currentValue &&
            this.localidade && this.configuracao && this.configuracao.length > 0
        ) {
            this._panoramaService.getTemas(this.configuracao, this.localidade).toPromise().then(resp => {
                this.temas = resp.configuracao;
                this.resultados = resp.resultados;
                this.rankings = resp.rankings;
            })
        }
    }

    private textos = {
         [TEMAS.trabalho.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

             let salarioMedioMensal = {
                 periodo: this.resultados[29765].periodoValidoMaisRecente,
                 res: this.resultados[29765].valorValidoMaisRecente,
                 rankingLocal: this.rankings[29765][this.localidade.codigoParent],
                 rankingGeral: this.rankings[29765]['BR']
             }
             let pessoasOcupadas = {
                 periodo: this.resultados[60036].periodoValidoMaisRecente,
                 res: this.resultados[60036].valorValidoMaisRecente,
                 rankingLocal: this.rankings[60036][this.localidade.codigoParent],
                 rankingGeral: this.rankings[60036]['BR']
             }
             let rendimentoMensal = {
                 periodo: this.resultados[60037].periodoValidoMaisRecente,
                 res: this.resultados[60037].valorValidoMaisRecente,
                 rankingLocal: this.rankings[60037][this.localidade.codigoParent],
                 rankingGeral: this.rankings[60037]['BR']
             }

             return `Em ${salarioMedioMensal.periodo}, o salário médio mensal era de ${salarioMedioMensal.res} salários mínimos. A proporção de pessoas ocupadas em relação à população total era de ${pessoasOcupadas.res}%. 
                Na comparação com os outros municípios do estado, ocupava as posições ${salarioMedioMensal.rankingLocal} de ${universoLocal} e ${pessoasOcupadas.rankingLocal} de ${universoLocal}, respectivamente. 
                Já na comparação com municípios do Brasil todo, ficava na posição ${salarioMedioMensal.rankingGeral} de ${universoGeral} e ${pessoasOcupadas.rankingGeral} de ${universoGeral}, respectivamente.
                Considerando domicílios com rendimentos mensais de até meio salário mínimo por pessoa, tinha ${rendimentoMensal.res}% da população nessas condições, o que o colocava na posição ${rendimentoMensal.rankingLocal} de ${universoLocal} dentre os municípios do estado e na posição ${rendimentoMensal.rankingGeral} de ${universoGeral} dentre os municípios do Brasil.`
         }
 
    }

    public getTexto(tema) {
        return this.textos[tema] ? this.textos[tema]() : '';
    }
}