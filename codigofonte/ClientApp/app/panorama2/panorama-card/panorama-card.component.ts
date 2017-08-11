import { Component, Input, OnChanges } from '@angular/core';

import { ResultadoPipe } from '../../shared2/resultado.pipe';


@Component({
    selector: 'panorama-card',
    templateUrl: './panorama-card.template.html',
    styleUrls: ['./panorama-card.style.css']
})
export class PanoramaCardComponent implements OnChanges {
    @Input() mostrarLinkRanking: boolean;
    @Input() indicadorId: number;
    @Input() pesquisaId: number;
    @Input() titulo = '';
    @Input() valor = '';
    @Input() unidade = '';
    @Input() ranking: any = {};
    @Input() selecionado: boolean;
    @Input() tipoLocalidade: string;

    public textoComparacao: string;
    public cssRanking: any = {};
    _resultadoPipe: ResultadoPipe;

    constructor() {
        this._resultadoPipe = new ResultadoPipe();
    }


    ngOnChanges(changes: any) {

        if (this._resultadoPipe.transform(this.valor) === 'Ignorado' ||
            this._resultadoPipe.transform(this.valor) === 'Não disponível' ||
            this._resultadoPipe.transform(this.valor) === 'Não informado' ||
            this._resultadoPipe.transform(this.valor) === 'Não existente' ||
            this._resultadoPipe.transform(this.valor) === '*' ||
            this._resultadoPipe.transform(this.valor) === '-') {

            this.ranking.BR.hasValor = false;

        } else {

            this.ranking.BR.hasValor = true;

        }

        if (this.ranking && this.ranking.BR) {
            this.cssRanking.BR = 'p' + this.calcularPercentualRanking(this.ranking.BR.posicao,  this.ranking.BR.itens);
        }
        if (this.tipoLocalidade === 'municipio' && this.ranking && this.ranking.local) {
            this.cssRanking.local = 'p' + this.calcularPercentualRanking(this.ranking.local.posicao,  this.ranking.local.itens);
        }
        if (this.tipoLocalidade === 'municipio' && this.ranking && this.ranking.microrregiao) {
            this.cssRanking.microrregiao = 'p' + this.calcularPercentualRanking(this.ranking.microrregiao.posicao,  this.ranking.microrregiao.itens);
        }

        if (this.tipoLocalidade) {
            this.textoComparacao = this.tipoLocalidade === 'municipio'
                ? 'Comparando a outros municípios'
                : 'Comparando a outros estados';
        }
    }

    private calcularPercentualRanking(posicao: number, numeroElementos: number): number {

        const numeroClasses = 1 + (3.322 * Math.log10(numeroElementos));

        let amplitudeClasse = numeroElementos / numeroClasses;
        let classe = Math.floor(posicao / amplitudeClasse);
        let percentual = Math.round(100 - (classe * (100 / numeroClasses)));


        return percentual;
    }
};
