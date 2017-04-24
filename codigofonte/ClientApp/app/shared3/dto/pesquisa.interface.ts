import { PeriodoPesquisaDTO } from './periodo-pesquisa.interface';

export interface PesquisaDTO {
    id: number
    nome: string
    descricao: string
    contexto: string
    observacao: string
    periodos: Array<PeriodoPesquisaDTO>
}