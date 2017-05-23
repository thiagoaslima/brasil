import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { converterObjArrayEmHash } from "../../utils2";
import { ItemConfiguracao } from "../configuration";

@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html'
})
export class PanoramaTemasComponent implements OnChanges {
    @Input() configuracao = [];
    @Input() localidade = null;
    @Input() resultados = [];

    public conteudos = [];

    private _valores = {};

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.hasOwnProperty('configuracao') && changes.configuracao.currentValue.length > 0) {
            const ordemTemas = [];
            const itens = changes.configuracao.currentValue.reduce( (objTemas, item) => {
                if (item.tema === '') {return objTemas;}
                
                

            }, {} as {[tema: string]: {tema: string, painel: ItemConfiguracao[], graficos: ItemConfiguracao[]}})
        }

        if (changes.hasOwnProperty('resultados') && changes.resultados.currentValue.length > 0) {
            this._valores = converterObjArrayEmHash(changes.resultados.currentValue, 'indicadorId', false);
        }
    }
}