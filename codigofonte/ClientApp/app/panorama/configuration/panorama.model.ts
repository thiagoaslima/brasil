import { Indicador } from '../../shared2/indicador/indicador.model';
import { Observable } from 'rxjs/Observable';

export interface PanoramaItem {
    titulo: string,
    subtitulo?: string,
    tema: string
    largura?: string
    link?: string
    pesquisa?: number
    indicador?: number
    unidade?: string
    visualizacao: PanoramaVisualizacao,
    indicador$: Observable<Indicador>
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
    public readonly painel: Array<PanoramaItem>
    public readonly complementos: Array<PanoramaItem>

    constructor({nome, painel = [], complementos = []}) {
        this.nome = nome,
        this.painel = painel;
        this.complementos = complementos;
    }
}
