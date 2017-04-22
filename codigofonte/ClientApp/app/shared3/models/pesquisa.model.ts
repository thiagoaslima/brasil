import { PeriodoPesquisa, PeriodoPesquisaDTO } from './index';
import { NiveisTerritoriais } from './index'

export interface PesquisaDTO {
    id: number
    nome: string
    descricao: string
    contexto: number
    observacao: string
    periodos: Array<PeriodoPesquisaDTO>
}

interface PesquisaParameters {
     id: number
    nome: string
    descricao: string
    contexto: number
    observacao: string
    periodos: Array<PeriodoPesquisa>
}

export class Pesquisa {
    static criar(data: PesquisaParameters) {
        return data;
    }

    public readonly id: number
    public readonly nome: string
    public readonly descricao: string
    public readonly observacao: string
    public readonly periodos: PeriodoPesquisa[]
    public readonly contextos: {[nivelTerritorial: string]: boolean}

    constructor(dados: PesquisaParameters) {
        this.id = dados.id;
        this.nome = dados.nome;
        this.descricao = dados.descricao;
        this.observacao = dados.observacao;
        this.periodos = dados.periodos;
        this.contextos = this._setContextos(dados.contexto);
    }

    abrangeNivelTerritorial(contexto: string) {
        return this.contextos[contexto];
    }

    getListaContextosValidos(): string[] {
        return this._contextos.filter(contexto => Boolean(this.contextos[contexto]));
    }

    private _contextos = [
        NiveisTerritoriais.pais.label,
        NiveisTerritoriais.macrorregiao.label,
        NiveisTerritoriais.uf.label,
        NiveisTerritoriais.ufSub.label,
        NiveisTerritoriais.municipio.label,
        NiveisTerritoriais.municipioSub.label
    ];

    private _setContextos(binario: number) {

        const contextos = Boolean(binario)
            ? binario.toString()
                .split('')
                .reverse()
                .map(str => Number.parseInt(str))
            : [];

        const len = contextos.length;
        contextos.length = 6;
        contextos.fill(0, len);

        return this._contextos.reduce((acc, propertyName, index) => {
            acc[propertyName] = Boolean(contextos[index]);
            return acc;
        }, {});
    }
}