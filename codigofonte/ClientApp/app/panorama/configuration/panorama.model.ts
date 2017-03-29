import { Indicador } from '../../shared2/indicador/indicador.model';
import { Observable } from 'rxjs/Observable';

export interface PanoramaItem {
    titulo: string
    tema: string
    largura?: string
    link?: string
    pesquisa?: number
    indicador?: number
    unidade?: string
    visualizacao: PanoramaVisualizacao
}

export enum PanoramaVisualizacao {
    graficoLinha,
    graficoBarra,
    mapa,
    numerico,
    painel
}


export class PanoramaTema {
    public readonly nome: string
    public readonly painel: Observable<Indicador>[]
    public readonly complementos: Array<{
        titulo: string
        indicador: Observable<Indicador>,
        visualizacao: PanoramaVisualizacao,
        largura?: string
    }>

    constructor({nome, painel = [], complementos = []}) {
        this.nome = nome,
        this.painel = painel;
        this.complementos = complementos;
    }
}
