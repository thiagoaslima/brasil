import { Component, Input, OnChanges } from '@angular/core';


@Component({
    selector: 'panorama-card',
    templateUrl: './panorama-card.template.html',
    styleUrls: ['./panorama-card.style.css']
})
export class PanoramaCardComponent implements OnChanges {
    @Input() titulo: string = ''
    @Input() valor: string = ''
    @Input() unidade: string = ''
    @Input() ranking: any = {};
    @Input('selecionado') isSelecionado;

    public cssRanking: any = {};
    
    ngOnChanges(changes: any) {
        if(this.ranking && this.ranking.BR) {
            this.cssRanking.BR = 'p' + this.calcularPercentualRanking(this.ranking.BR.posicao, this.ranking.BR.itens);
        }
        if(this.ranking && this.ranking.local) {
            this.cssRanking.local = 'p' + this.calcularPercentualRanking(this.ranking.local.posicao, this.ranking.local.itens);
        }
        if(this.ranking && this.ranking.microrregiao) {
            this.cssRanking.microrregiao = 'p' + this.calcularPercentualRanking(this.ranking.microrregiao.posicao, this.ranking.microrregiao.itens);
        }
    }

    private calcularPercentualRanking(posicao: number, numeroElementos: number): number{

        const numeroClasses = 20;

        let amplitudeClasse = numeroElementos / numeroClasses;
        let classe = Math.round(posicao / amplitudeClasse);
        let percentual = 100 - (classe * (100 / numeroClasses));


        return percentual;
    }
}