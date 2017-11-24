import { Unidade } from '..';

export class Ranking {
    indicadorId: number
    periodo: number
    contexto: string|number
    unidade: Unidade
    res: Array<{
        '#': number,
        ranking: number,
        localidadeId: string,
        res: string
    }>

    constructor(dados) {
        this.indicadorId = dados.indicador
        this.periodo = dados.periodo
        this.contexto = dados.contexto
        this.unidade = dados.unidade
        this.res = dados.res
    }
}