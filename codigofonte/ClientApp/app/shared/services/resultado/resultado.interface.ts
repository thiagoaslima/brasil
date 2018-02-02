export interface ResultadoDTO {
    id: number,
    res: Array<{
        "localidade": string,
        "res": { [periodo: string]: string }
    }>
}