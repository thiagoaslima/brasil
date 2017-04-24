export interface IndicadorDTO {
    id: number
    posicao: string
    indicador: string
    classe: string
    children: IndicadorDTO[]
    unidade?: {
        id: string
        classe: string
        multiplicador: number
    }
    metadado?: {
        descricao: string
        calculo: string
    }
    nota: string[]
    pesquisa_id?: number
}