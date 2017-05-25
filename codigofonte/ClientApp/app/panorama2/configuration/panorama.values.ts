import { Indicador, Localidade, Resultado } from '../../shared3/models';

export const PanoramaVisualizacao = {
    grafico: "grafico",
    mapa: "cartograma",
    numerico: "numero",
    painel: "painel"
}

export interface ItemConfiguracao {
    indicadorId: number
    pesquisaId?: number
    periodo?: string
    fontes?: string[]

    titulo?: string
    tema: string
    largura?: string

    visualizacao: string
    grafico?: {
        titulo: string
        tipo: string,
        dados: Array<{
            indicadorId: number
            pesquisaId?: number
        }>
    }

    correlacaoPositivaValorQualidade?: boolean
    correlacaoNegativaValorQualidade?: boolean
}

export interface ItemTemaView {
    tema: string

    painel: Array<{
        titulo: string
        indicador: Indicador
        localidade: Localidade
        periodo: string
        valor: string
        ranking: { [contexto: string]: number }
        fontes: string[]
        link: string
    }>
    
    graficos: Array<{
        titulo: string
        tipo: string
        fontes: string[]
        link: string
    }>
}