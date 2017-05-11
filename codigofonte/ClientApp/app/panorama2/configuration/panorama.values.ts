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
    
    visualizacao: string
    grafico?: {
        titulo: string
        tipo: string,
        dados: Array<{
            indicadorId: number
            pesquisaId?: number
        }>
    }
}