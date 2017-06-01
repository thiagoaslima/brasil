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
            this.cssRanking.BR = (this.ranking.BR.posicao / this.ranking.BR.itens)*96;
        }
        if(this.ranking && this.ranking.local) {
            this.cssRanking.local = (this.ranking.local.posicao / this.ranking.local.itens)*96;
        }
        if(this.ranking && this.ranking.microrregiao) {
            this.cssRanking.microrregiao = (this.ranking.microrregiao.posicao / this.ranking.microrregiao.itens)*96;
        }
    }
}