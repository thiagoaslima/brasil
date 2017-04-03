import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { Indicador } from '../../shared2/indicador/indicador.model';
import { Observable } from 'rxjs/Observable';

export interface PanoramaConfigurationItem {
    titulo: string,
    subtitulo?: string,
    tema: string
    largura?: string
    link?: string
    pesquisaId: number
    indicadorId: number
    unidade?: string
    visualizacao: string,
    indicador: Indicador
}

export const PanoramaVisualizacao = {
    graficoLinha: "linha",
    graficoBarra: "barra",
    mapa: "cartograma",
    numerico: "numero",
    painel: "painel"
}

export type PanoramaItem = {
    tema: string, 
    painel: PanoramaConfigurationItem[]
    graficos: PanoramaConfigurationItem[]
}

export type PanoramaDescriptor = PanoramaItem[]
