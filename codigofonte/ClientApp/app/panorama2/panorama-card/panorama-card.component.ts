import { Component, Input, OnChanges } from '@angular/core';


@Component({
    selector: 'panorama-card',
    templateUrl: './panorama-card.template.html',
    styleUrls: ['./panorama-card.style.css']
})
export class PanoramaCardComponent implements OnChanges {
    @Input() titulo = '';
    @Input() valor = '';
    @Input() unidade = '';
    @Input() ranking: any = {};
    @Input() selecionado: boolean;
    @Input() tipoLocalidade: string;

    public textoComparacao: string;
    public cssRanking: any = {};
    
    ngOnChanges(changes: any) {
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

        const numeroClasses = 20;

        let amplitudeClasse = numeroElementos / numeroClasses;
        let classe = Math.round(posicao / amplitudeClasse);
        let percentual = 100 - (classe * (100 / numeroClasses));


        return percentual;
    }
}