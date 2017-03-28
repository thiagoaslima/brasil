import { ResultadoIndicadorServer, ResultadoLocalidadeServer } from './server.interfaces';
import { RetrieveStrategy, StateStrategyManager } from '../strategies/strategy.interface';

import { Observable } from 'rxjs/Observable';

export class Resultado {
    pesquisa: number
    indicador: number
    localidade: number
    periodos: string[]
    valores: string[]

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
        }, []);
    }

    get periodoMaisRecente() {
        return this.periodos[this.periodos.length - 1];
    }

    get periodoValidoMaisRecente() {
        const arr = this.periodosValidos;
        return arr[arr.length - 1];
    }

    constructor(
        pesquisa: number,
        indicador: number,
        localidade: number,
        resultados: { [periodo: string]: string }
    ) {
        this.pesquisa = pesquisa;
        this.indicador = indicador;
        this.localidade = localidade;
        this.periodos = Object.keys(resultados).sort();
        this.valores = this.periodos.map(periodo => resultados[periodo]);
    }

    public valor(periodo) {
        const index = this.periodos.indexOf(periodo);
        return this.valores[index];
    }

    private _isValorValido(valor) {
        return valor !== null && valor !== undefined;
    }
}

/*
export class ResultadosIndicador {
    private _resultados = [] as Resultado[];
    private _states = Object.create(null);

    constructor(resultados: Resultado[] = []) {
        resultados.forEach(this._gravar);
    }

    get todos(): Resultado[] {
        return this._resultados.splice(0);
    }

    static setStrategy(strategy: RetrieveStrategy<Observable<Resultado[]>>) {
        ResultadosIndicador.prototype._strategy = strategy;
    }
    private _strategy: RetrieveStrategy<Observable<Resultado[]>>

    noLocal(codigoLocalidade: number): Observable<Resultado> {
        const resultado = this._resultados.find(resultado => resultado.localidade === codigoLocalidade);

        if (resultado) {
            return Observable.of(resultado);
        }

         if (!this._strategy) {
            throw new ReferenceError('No strategy was registered')
        }
        
        if (!this._states[codigoLocalidade]) {
            this._states[codigoLocalidade] = new StateStrategyManager(this._strategy.retrieve(this.id));
        }
        
        if (this._states[codigoLocalidade].isInitial()) {
            this._states[codigoLocalidade].update().do(resultado => {
                this._gravar(resultado);
            });
        }
    }

    nosLocais(codigoLocalidade: number[]|string): Observable<Resultado> {
        const locais = Array.isArray(codigoLocalidade) ? codigoLocalidade.join()
        const resultado = this._resultados.find(resultado => resultado.localidade === codigoLocalidade);

        if (resultado) {
            return Observable.of(resultado);
        }

         if (!this._strategy) {
            throw new ReferenceError('No strategy was registered')
        }
        
        if (!this._states[codigoLocalidade]) {
            this._states[codigoLocalidade] = new StateStrategyManager(this._strategy.retrieve(this.id));
        }
        
        if (this._states[codigoLocalidade].isInitial()) {
            this._states[codigoLocalidade].update().do(resultado => {
                this._gravar(resultado);
            });
        }
    }
    
    noPeriodo(periodo: string): ResultadosIndicador {
        const arr = this._resultados.filter(resultado => resultado.periodos.indexOf(periodo) >= 0);
        return new ResultadosIndicador(arr);
    }

    valores(codigoLocalidade: number): Observable<string[]> {
        return this.noLocal(codigoLocalidade).map(resultado => resultado.valores);
    }

    valoresValidos(codigoLocalidade: number): string[] {
        const resultado = this.noLocal(codigoLocalidade);
        return resultado.valoresValidos;
    }

    valor(codigoLocalidade: number, periodo: string): string {
        const resultado = this.noLocal(codigoLocalidade);
        return resultado.valor(periodo);
    }

    valorMaisRecente(codigoLocalidade: number): string {
        const resultado = this.noLocal(codigoLocalidade);
        return resultado.valorMaisRecente;
    }

    valorValidoMaisRecente(codigoLocalidade: number): string {
        const resultado = this.noLocal(codigoLocalidade);
        return resultado.valorValidoMaisRecente;
    }

    private _find(resultado: Resultado) {
        return this._resultados.find(_res => {
            return _res.indicador == resultado.indicador &&
                _res.localidade == resultado.localidade;
        });
    }

    private _gravar(resultado: Resultado) {
        const _res = this._find(resultado);
        if (_res) {
            return this._update(_res, resultado);
        }
        this._resultados.push(resultado);
        this._states[resultado.localidade] = new StateStrategyManager(Observable.of(resultado));
    }

    private _update(original: Resultado, atualizacao: Resultado) {
        Object.assign(original, atualizacao);
    }

}
*/