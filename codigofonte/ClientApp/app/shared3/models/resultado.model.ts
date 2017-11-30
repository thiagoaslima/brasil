import { ResultadoDTO } from '../dto';
import { Indicador } from '.';

export interface ResultadoParameters {
    id: number;
    codigoLocalidade: string;
    res?: { [periodo: string]: string };
    indicador?: Indicador;
    localidade?: any;
    periodos?: string[];
}

/*
 * TODO
 * Resultado receber os períodos já ordenados 
*/
export class Resultado {
    static criar(dados: ResultadoParameters) {
        return new Resultado(dados);
    }
    static convertDTOintoParameters(dados: ResultadoDTO | ResultadoDTO[]): ResultadoParameters[] {
        const array = Array.isArray(dados) ? dados : [dados];

        return array.reduce((acc, dados) => {
            let arr = dados.res.map(item => ({
                id: dados.id,
                codigoLocalidade: item.localidade,
                res: item.res
            }));
            return acc.concat(arr);
        }, []);
    }

    public readonly indicadorId?: number;
    public readonly indicador?: Indicador;
    public readonly codigoLocalidade: number;
    public readonly localidade?;
    public readonly periodos: string[];
    public readonly valores: string[];

    constructor({ id, codigoLocalidade, res = [], indicador, localidade, periodos } = {} as ResultadoParameters) {

        this.indicadorId = id;
        this.codigoLocalidade = Number.parseInt(codigoLocalidade, 10);

        this.periodos = periodos || Object.keys(res).sort().reverse();
        this.valores = this.periodos.map(periodo => res[periodo]);

        if (indicador) {
            this.indicador = indicador;
        }
        if (localidade) {
            this.localidade = localidade;
        }
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
