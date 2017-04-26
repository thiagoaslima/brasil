import { Pesquisa } from './'
import { EscopoIndicadores } from '../values'

export interface IndicadorParameters {
    id: number;
    indicador: string;
    posicao: string;
    classe: string;
    children: IndicadorParameters[]
    pesquisa_id?: number
    pesquisa?: Pesquisa
    nota: string[]
    metadado?: {
        descricao: string
        calculo: string
    }
    unidade?: {
        id: string
        classe: string
        multiplicador: number
    }
}

export class Indicador {
    static criar(dados: IndicadorParameters) {
        return new Indicador(dados);
    }

    public readonly id: number;
    public readonly nome: string;
    public readonly posicao: string;
    public readonly classe: string;
    public readonly pesquisaId?: number
    public readonly pesquisa?: Pesquisa
    public readonly indicadores: Indicador[]
    public readonly notas: string[]
    public readonly metadados: {
        descricao: string
        calculo: string
    }
    public readonly unidade: {
        nome: string
        classe: string
        multiplicador: number
    }

    constructor(dados: IndicadorParameters) {
        this.id = dados.id;
        this.nome = dados.indicador;
        this.posicao = dados.posicao;
        this.classe = dados.classe;
        this.notas = dados.nota.slice(0);

        this.indicadores = dados.children.map(Indicador.criar);

        this.metadados = Object.assign({
            descricao: '',
            calculo: ''
        }, dados.metadado);

        if (dados.unidade) {
            this.unidade = {
                nome: dados.unidade.id || '',
                classe: dados.unidade.classe || '',
                multiplicador: dados.unidade.multiplicador || 1
            }
        } else {
            this.unidade = {
                nome: '',
                classe: '',
                multiplicador: 1
            };
        }

        if (dados.pesquisa_id) { this.pesquisaId = dados.pesquisa_id; }
        if (dados.pesquisa) { this.pesquisa = dados.pesquisa; }
    }
}