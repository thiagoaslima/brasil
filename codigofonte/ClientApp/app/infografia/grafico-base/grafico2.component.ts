import { Component, Input } from '@angular/core';

@Component({
    selector: 'grafico',
    templateUrl: 'grafico.template.html',
    styleUrls: ['grafico.style.css']
})
export class GraficoComponent {
    /** VALORES **/
    @Input() titulo: string;
    @Input('eixoX') labelsEixoX: string[];
    @Input() dados: number[] | Array<{data: number[], label: string}>

    /** CONFIGURAÇÃO **/
    @Input('mostrar-legenda') mostrarLegenda: boolean
    @Input('posicao-legenda') posicaoLegenda: string
    @Input('zero-na-origem') comecaNoZero: boolean 
}