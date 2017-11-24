import { ResultadoDTO } from '..';
import { IndicadorDTO } from '.';
import { Pesquisa, Resultado, Unidade } from '..';
import { escopoIndicadores } from '../values';

export interface IndicadorParameters extends IndicadorDTO {
    id: number;
    indicador: string;
    posicao: string;
    classe: string;
    children: IndicadorParameters[];
    pesquisa_id?: number;
    pesquisa?: Pesquisa;
    nota: string[];
    fonte?: string[];
    metadado?: {
        descricao: string
        calculo: string
    };
    unidade?: {
        id: string
        classe: string
        multiplicador: number
    };
    resultados?: Resultado[];
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
    public readonly fontes: string[]
    public readonly metadados: {
        descricao: string
        calculo: string
    }
    public readonly unidade: {
        nome: string
        classe: string
        multiplicador: number
    }
    public readonly resultados?: Resultado[]

    constructor(dados: IndicadorParameters) {
        if (!dados.pesquisa && !dados.pesquisa_id) {
            throw new Error('Obrigatório informar a id da pesquisa ou passar o objeto Pesquisa completo para o construtor do Indicador');
        }

        this.id = dados.id;
        this.nome = dados.indicador;
        this.posicao = dados.posicao;
        this.classe = dados.classe;
        this.notas = dados.nota.slice(0);
        this.fontes = dados.fonte;

        this.indicadores = dados.children.map(child => {
            return dados.pesquisa
                ? Indicador.criar(Object.assign(child, { pesquisa: dados.pesquisa }))
                : Indicador.criar(Object.assign(child, { pesquisa_id: dados.pesquisa_id }))
        });

        this.metadados = Object.assign({
            descricao: '',
            calculo: ''
        }, dados.metadado);

        if (dados.unidade) {
            this.unidade = new Unidade({
                nome: dados.unidade.id,
                classe: dados.unidade.classe,
                multiplicador: dados.unidade.multiplicador
            });
        } else {
            this.unidade = new Unidade({});
        }

        if (dados.pesquisa_id && !dados.pesquisa) { this.pesquisaId = dados.pesquisa_id; }
        if (dados.pesquisa) { this.pesquisa = dados.pesquisa; }

        if (dados.res) { this.resultados = Resultado.convertDTOintoParameters({ id: this.id, res: dados.res }).map(Resultado.criar); }
    }

    getResultadoByLocal(localidadeCodigo: number): Resultado {
        return this.resultados.find(resultado => resultado.codigoLocalidade === localidadeCodigo) || null;
    }
}
