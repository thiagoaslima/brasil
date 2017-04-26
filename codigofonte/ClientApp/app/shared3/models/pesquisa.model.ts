import { converterEmNumero } from '../../utils2';
import { PesquisaDTO } from '../dto';
import { niveisTerritoriais } from '../values';

export class Pesquisa {
    static criar(data: PesquisaDTO) {
        return new Pesquisa(data);
    }

    public readonly id: number
    public readonly nome: string
    public readonly descricao: string
    public readonly observacao: string
    public readonly periodos: Array<{
        nome: string,
        dataPublicacao: Date,
        fontes: string[],
        notas: string[]
    }>
    public readonly contextos: { [nivelTerritorial: string]: boolean }

    constructor(dados: PesquisaDTO) {
        this.id = dados.id;
        this.nome = dados.nome;
        this.descricao = dados.descricao || "";
        this.observacao = dados.observacao || "";
        this.periodos = this._setPeriodos(dados.periodos);
        this.contextos = this._setContextos(Number.parseInt(dados.contexto, 10));
    }

    abrangeNivelTerritorial(contexto: string) {
        return this.contextos[contexto];
    }

    getContextosValidos(): string[] {
        return this._contextos.filter(contexto => Boolean(this.contextos[contexto]));
    }

    getAllFontes() {
        const fontes = this.periodos.reduce((fontes, periodo) => fontes.concat(periodo.fontes), [] as string[]);
        return Array.from(new Set(fontes));
    }

    getFontesDoPeriodo(periodo: string) {
        const obj = this.periodos.find(_periodo => _periodo.nome === periodo);
        return obj ? obj.fontes : [];
    }

    getAllNotas() {
        const notas = this.periodos.reduce((notas, periodo) => notas.concat(periodo.notas), [] as string[]);
        return Array.from(new Set(notas))
    }

    getNotasDoPeriodo(periodo: string) {
        const obj = this.periodos.find(_periodo => _periodo.nome === periodo);
        return obj ? obj.notas : [];
    }


    private _contextos = [
        niveisTerritoriais.pais.label,
        niveisTerritoriais.macrorregiao.label,
        niveisTerritoriais.uf.label,
        niveisTerritoriais.ufSub.label,
        niveisTerritoriais.municipio.label,
        niveisTerritoriais.municipioSub.label
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
        contextos.reverse();

        return this._contextos.reduce((acc, propertyName, index) => {
            acc[propertyName] = Boolean(contextos[index]);
            return acc;
        }, {});
    }

    private _setPeriodos(periodos) {
        return periodos.map(periodo => {
            const nome = periodo.periodo;
            const fontes = periodo.fonte;
            const notas = periodo.nota;
            let dataPublicacao = null;

            if (periodo.publicacao) {
                const [data, horario] = periodo.publicacao.split(' ');
                const [dia, mes, ano] = data.split('/').map(converterEmNumero);
                const [hora, minuto, segundo] = horario.split(':').map(converterEmNumero);
                dataPublicacao = new Date(Date.UTC(ano, mes - 1, dia, hora, minuto, segundo));
            }

            return {
                nome,
                dataPublicacao,
                fontes,
                notas
            };
        })
    }
}