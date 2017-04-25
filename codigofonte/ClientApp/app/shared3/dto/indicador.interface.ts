export interface IndicadorDTO {
    id: number
    indicador: string
    posicao: string
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
    pesquisa_id?: number,
    res?: string[]
}