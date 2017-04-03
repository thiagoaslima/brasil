import { Pesquisa } from '../pesquisa/pesquisa.model';
import { Indicador, EscopoIndicadores } from '../indicador/indicador.model';
import { Validador } from '../../utils/validador.class';
import { flat } from '../../utils/flatFunctions';

import { Observable } from 'rxjs/Observable';

const resultadoValidador = new Validador();
resultadoValidador.resgitrarTestes([
    {
        propriedade: 'indicadorId',
        mensagemErro: 'valor inválido para indicadorId.',
        funcaoTeste: (data) => Number.isInteger(data.indicadorId)
    },

    {
        propriedade: 'localidadeCodigo',
        mensagemErro: 'valor inválido para localidadeCodigo.',
        funcaoTeste: (data) => Number.isInteger(data.localidadeCodigo)
    },
])

const _resultadoDefaults = {
    indicadorId: null,
    localidadeCodigo: null,
    periodos: [] as string[],
    valores: [] as string[]
}

export class Resultado {

    static criar(data, validador = resultadoValidador): Resultado {
        return validador.validar(data, (data) => new Resultado(data))
    }

    static converterGroupedByIndicador(array: { id: number, res: { localidade: string, res: Object }[] }[]) {
        const arr = array.map(item => {
            return item.res.map(resultado => {
                return {
                    indicadorId: item.id,
                    localidadeCodigo: parseInt(resultado.localidade, 10),
                    periodos: Object.keys(resultado.res),
                    valores: Object.keys(resultado.res).map(periodo => resultado.res[periodo])
                };
            });
        });

        return flat(arr);
    }

    static converterFromIndicadorBody(indicadorId: number, res: { localidade: string, res: Object }[]) {
        return Resultado.converterGroupedByIndicador([{ id: indicadorId, res }]);
    }

    static resultadoStrategy = null;
    static get(pesquisaId: number, posicaoIndicador: string, codigoLocalidade: number): Observable<Resultado> {
        return Resultado.resultadoStrategy.retrieve(pesquisaId, posicaoIndicador, codigoLocalidade, EscopoIndicadores.proprio)
            .map(arr => arr[0])
    }

    static getFilhos(pesquisaId: number, posicaoIndicador: string, codigoLocalidade: number) {
        return Resultado.resultadoStrategy.retrieve(pesquisaId, posicaoIndicador, codigoLocalidade, EscopoIndicadores.filhos)
    }

    static setResultadoStrategy(strategy) {
        Resultado.resultadoStrategy = strategy;
    }

    public readonly indicadorId: number
    public readonly localidadeCodigo: number
    public readonly periodos: string[]
    public readonly valores: string[]

    constructor(data) {
        data = Object.assign({}, _resultadoDefaults, data);
        Object.keys(_resultadoDefaults).forEach(property => {
            this[property] = data[property];
        });
    }

    get valoresValidos() {
        return this.valores.filter(this._isValorValido);
    }

    get valorMaisRecente() {
        return this.valores[this.valores.length - 1];
    }

    get valorValidoMaisRecente() {
        const arr = this.valoresValidos;
        return arr[arr.length - 1];
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
        return this.periodos[this.periodos.length - 1];
    }

    get periodoValidoMaisRecente() {
        const arr = this.periodosValidos;
        return arr[arr.length - 1];
    }

    public getValor(periodo) {
        const index = this.periodos.indexOf(periodo);
        return this.valores[index];
    }

    private _isValorValido(valor) {
        return valor !== null && valor !== undefined;
    }
}