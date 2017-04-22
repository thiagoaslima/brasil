import { converterEmNumero } from '../../utils2';

export interface PeriodoPesquisaDTO {
    nome: string,
    publicacao: string,
    fonte: string[],
    nota: string[]
}

export class PeriodoPesquisa {
    static criar(dados: PeriodoPesquisaDTO) {
        return new PeriodoPesquisa(dados);
    }

    public readonly nome: string;
    public readonly dataPublicacao: Date | null;
    public readonly fontes: string[];
    public readonly notas: string[];

    constructor(dados: PeriodoPesquisaDTO) {
        this.nome = dados.nome;
        this.fontes = dados.fonte;
        this.notas = dados.nota;

        if (dados.publicacao) {
            const [data, horario] = dados.publicacao.split(' ');
            const [dia, mes, ano] = data.split('/').map(converterEmNumero);
            const [hora, minuto, segundo] = horario.split(':').map(converterEmNumero);
            this.dataPublicacao = new Date(ano, mes, dia, hora, minuto, segundo);
        } else {
            this.dataPublicacao = null;
        }
    }
}