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
            this.cssRanking.BR = 'p' + Math.round( 100 - (this.ranking.BR.posicao / this.ranking.BR.itens)*100 );
        }
        if(this.ranking && this.ranking.local) {
            this.cssRanking.local = 'p' + Math.round( 100 - (this.ranking.local.posicao / this.ranking.local.itens)*100 );
        }
        if(this.ranking && this.ranking.microrregiao) {
            this.cssRanking.microrregiao = 'p' + Math.round( 100 - (this.ranking.microrregiao.posicao / this.ranking.microrregiao.itens)*100 );
        }
    }
}