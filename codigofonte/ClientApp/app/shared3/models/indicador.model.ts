import { IndicadorDTO } from '../dto';
import { Pesquisa } from './'
import { EscopoIndicadores } from '../values'

export class Indicador {
    static criar(dados: IndicadorDTO) {
        return new Indicador(dados);
    }

    public readonly id: number;
    public readonly nome: string;
    public readonly posicao: string;
    public readonly classe: string;
    public readonly pesquisaId?: number
    public readonly pesquisa?: Pesquisa
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

    constructor(dados: any) {
        this.id = dados.id;
        this.nome = dados.indicador;
        this.posicao = dados.posicao;
        this.classe = dados.classe;
        this.notas = dados.nota;

        this.metadados = Object.assign({
            descricao: '',
            calculo: ''
        }, dados.metadado);

        this.unidade = Object.assign({
            nome: '',
            classe: '',
            multiplicador: 1
        },{
            nome: dados.unidade.id,
            classe: dados.unidade.classe,
            multiplicador: dados.unidade.multiplicador
        })

        if (dados.pesquisa_id) { this.pesquisaId = dados.pesquisa_id; }
        if (dados.pesquisa) { this.pesquisa = dados.pesquisa; }
    }
}