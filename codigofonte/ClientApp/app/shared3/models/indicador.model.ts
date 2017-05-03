import { IndicadorDTO } from '../dto';
import { Pesquisa } from './'
import { escopoIndicadores } from '../values'

export interface IndicadorParameters extends IndicadorDTO {
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
        if (!dados.pesquisa && !dados.pesquisa_id) {
            throw new Error('Obrigatório informar a id da pesquisa ou passar o objeto Pesquisa completo para o construtor do Indicador');
        }

        this.id = dados.id;
        this.nome = dados.indicador;
        this.posicao = dados.posicao;
        this.classe = dados.classe;
        this.notas = dados.nota.slice(0);

        this.indicadores = dados.children.map(child => {
            return dados.pesquisa 
                ? Indicador.criar(Object.assign(child, {pesquisa: dados.pesquisa}))
                : Indicador.criar(Object.assign(child, {pesquisa_id: dados.pesquisa_id}))
        });

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

        if (dados.pesquisa_id && !dados.pesquisa) { this.pesquisaId = dados.pesquisa_id; }
        if (dados.pesquisa) { this.pesquisa = dados.pesquisa; }

    }
}
