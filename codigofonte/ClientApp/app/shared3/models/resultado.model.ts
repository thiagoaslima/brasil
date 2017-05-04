import { ResultadoDTO } from '../dto';

export interface ResultadoParameters {
    id: number
    localidade: string
    res?: { [periodo: string]: string }
}
export class Resultado {
    static criar(dados: ResultadoParameters) {
        return new Resultado(dados);
    }
    static convertDTOintoParameters(dados: ResultadoDTO | ResultadoDTO[]): ResultadoParameters[] {
        const array = Array.isArray(dados) ? dados : [dados];

        return array.reduce((acc, dados) => {
            let arr = dados.res.map(item => ({
                id: dados.id,
                localidade: item.localidade,
                res: item.res
            }))
            return acc.concat(arr);
        }, []);
    }

    public readonly indicadorId: number
    public readonly localidadeCodigo: number
    public readonly periodos: string[]
    public readonly valores: string[]

    constructor({ id, localidade, res = [] } = {} as ResultadoParameters) {
        this.indicadorId = id;
        this.localidadeCodigo = Number.parseInt(localidade, 10);

        const periodos = Object.keys(res).sort().reverse();
        this.periodos = periodos;
        this.valores = periodos.map(periodo => res[periodo]);
    }

    get valoresValidos() {
        return this.valores.filter(this._isValorValido);
    }

    get valorMaisRecente() {
        return this.valores[0] || '-';
    }

    get valorValidoMaisRecente() {
        return this.valoresValidos[0] || '-';
    }

    get periodosValidos() {
        return this.valores.reduce((arr, valor, idx) => {
            if (this._isValorValido(valor)) {
                arr.push(this.periodos[idx]);
            }
            return arr;
        }, [] as string[]);
    }

    get periodoMaisRecente() {
        return this.periodos[0];
    }

    get periodoValidoMaisRecente() {
        return this.periodosValidos[0] || '-';
    }

    public getValor(periodo) {
        const index = this.periodos.indexOf(periodo);
        return index >= 0 ? this.valores[index] : '-';
    }

    private _isValorValido(valor) {
        return valor !== null && valor !== undefined;
    }
}
