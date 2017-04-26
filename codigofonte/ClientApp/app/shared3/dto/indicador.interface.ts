export interface IndicadorDTO {
    id: number
    indicador: string
    posicao: string
    classe: string
    children: IndicadorDTO[]
    pesquisa_id?: number,
    nota: string[]
    unidade?: {
        id: string
        classe: string
        multiplicador: number
    }
    metadado?: {
        descricao: string
        calculo: string
    }
    res?: string[]
}