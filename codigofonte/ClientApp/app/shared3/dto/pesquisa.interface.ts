export interface PesquisaDTO {
    id: number
    nome: string
    descricao: string
    contexto: string
    observacao: string
    periodos: Array<{
        periodo: string,
        publicacao: string,
        fonte: string[],
        nota: string[]
    }>
}