import { Indicador, Localidade, Resultado } from '../../shared3/models';

export const PanoramaVisualizacao = {
    grafico: 'grafico',
    mapa: 'cartograma',
    numerico: 'numero',
    painel: 'painel'
}

export interface ItemConfiguracao {
    indicadorId?: number
    pesquisaId?: number
    categoria?: string
    servico?: 'conjunturais'
    periodo?: string
    quantidadePeriodos?: number
    fontes?: string[]

    titulo?: string
    tema: string
    largura?: string

    visualizacao: string
    grafico?: {
        titulo: string,
        tipo: string,
        fontes?: string[],
        dados: Array<{
            indicadorId: number
            pesquisaId?: number
            categoria?: string
            servico?: 'conjunturais'
            quantidadePeriodos?: number
        }>
    }

    correlacaoPositivaValorQualidade?: boolean
    correlacaoNegativaValorQualidade?: boolean
}

export interface dadosGrafico {
    tipo: string
    titulo: string
    eixoX: string[]
    dados: Array<{data: number[], label: string}>
    fontes?: string
    link?: string 
}

export interface dadosPainel {
    mostrarLinkRanking: boolean
    pesquisaId: number
    indicadorId: number
    titulo: string
    valor: string
    unidade: string
    ranking?: {
        [contexto: string]: {
            posicao: number,
            itens: number
        }
    }
}