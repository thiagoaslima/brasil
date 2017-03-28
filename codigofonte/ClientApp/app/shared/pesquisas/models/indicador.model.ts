import { IndicadorServer } from './server.interfaces'
import { Pesquisa } from './pesquisa.model'
import { Resultado } from './resultado.model'
import { RetrieveStrategy, StateStrategyManager } from '../strategies/strategy.interface'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

export class Indicador {

    static is(obj) {
        return obj instanceof this;
    }

    static setIndicadoresFilhoStrategy(strategy: RetrieveStrategy<Observable<Indicador[]>>) {
        Indicador.prototype._indicadoresFilhoStrategy = strategy;
    }

    static setIndicadorPaiStrategy(strategy: RetrieveStrategy<Observable<Indicador>>) {
        Indicador.prototype._indicadorPaiStrategy = strategy;
    }

    static setPesquisaStrategy(strategy: RetrieveStrategy<Observable<Pesquisa>>) {
        Indicador.prototype._pesquisaStrategy = strategy;
    }

    static setResultadoStrategy(strategy: RetrieveStrategy<Observable<Resultado>>) {
        Indicador.prototype._resultadoStrategy = strategy;
    }


    id: number
    nome: string
    posicao: string
    classe: string
    unidade: UnidadeIndicador
    notas: any[]
    metadado: MetadadoIndicador
    pesquisaId: number

    get indicadores(): Observable<Indicador[]> {
        if (this._indicadores !== undefined) {
            return Observable.of(this._indicadores);
        }

        if (!this._indicadoresFilhoStrategy) {
            throw new ReferenceError('No indicadoresFilhoStrategy was registered')
        }

        if (!this._states.indicadores) {
            this._states.indicadores = this._indicadoresFilhoStrategy.retrieve(this.pesquisaId, this.posicao)
                .do(indicadores => this._indicadores = indicadores)
                .share();
        }

        return this._states.indicadores;
    }

    get indicadorPai(): Observable<Indicador> {
        if (!this._posicaoPai) {
            this._indicadorPai = null;
        }

        if (this._indicadorPai !== undefined) {
            return Observable.of(this._indicadorPai);
        }

        if (!this._indicadorPaiStrategy) {
            throw new ReferenceError('No indicadorPaiStrategy was registered')
        }

        if (!this._states.indicadoPai) {
            this._states.indicadoPai = this._indicadorPaiStrategy.retrieve(this.pesquisaId)
                .do(indicador => this._indicadorPai = indicador)
                .share();
        }

        return this._states.indicadoPai;
    }

    get pesquisa(): Observable<Pesquisa> {
        if (this._pesquisa !== undefined) {
            return Observable.of(this._pesquisa);
        }

        if (!this._pesquisaStrategy) {
            throw new ReferenceError('No pesquisaStrategy was registered')
        }

        if (!this._states.pesquisa) {
            this._states.pesquisa = this._pesquisaStrategy.retrieve(this.id)
                .do(pesquisa => this._pesquisa = pesquisa)
                .share();
        }

        return this._states.pesquisa;
    }

    getResultado(codigoLocalidade): Observable<Resultado> {
        const resultado = this._resultados.find(item => item.localidade === codigoLocalidade);
        if (resultado) {
            return Observable.of(resultado);
        }

         if (!this._resultadoStrategy) {
            throw new ReferenceError('No resultadoStrategy was registered')
        }

        if (!this._states.resultados[codigoLocalidade]) {
            this._states.resultados[codigoLocalidade] = this._resultadoStrategy.retrieve(this.pesquisaId, this.posicao, codigoLocalidade)
                .do(resultado => this.gravarResultado(resultado))
                .share();
        }

        return this._states.pesquisa;
    }

    gravarResultado(resultado) {
        const _res = this._findResultado(resultado);
        if (_res) {
            return this._updateResultado(_res, resultado);
        }
        this._resultados.push(resultado);
        return resultado;
    }

    constructor(protoIndicador: IndicadorServer) {
        const _defaults = Object.assign({
            id: 0,
            posicao: '',
            indicador: '',
            classe: '',
            unidade: {},
            notas: [],
            metadado: {
                descricao: '',
                calculo: ''
            },
            pesquisaId: null,
            res: null
        }, protoIndicador);

        this.id = _defaults.id;
        this.posicao = _defaults.posicao;
        this.nome = _defaults.indicador;
        this.classe = _defaults.classe;
        this.pesquisaId = _defaults.pesquisaId;
        this.unidade = new UnidadeIndicador(_defaults.unidade || {});
        this.metadado = new MetadadoIndicador(_defaults.metadado || {});
        this.notas = _defaults.notas;

        this._posicaoPai = _defaults.posicao.split('.').slice(0, -1).join('.');
    }

    private _findResultado(resultado): Resultado {
        return this._resultados.find(_resultado => {
            return _resultado.localidade === resultado.localidade
        });
    }

    private _updateResultado(destino, novo): Resultado {
        return Object.assign(destino, novo);
    }

    private _indicadores: Indicador[]
    private _indicadorPai: Indicador;
    private _pesquisa: Pesquisa;
    private _resultados: Resultado[] = [];


    private _states = {
        indicadores: null,
        indicadoPai: null,
        pesquisa: null,
        resultados: Object.create(null)
    }

    private _posicaoPai: string;
    private _indicadoresFilhoStrategy: RetrieveStrategy<Observable<Indicador[]>>
    private _indicadorPaiStrategy: RetrieveStrategy<Observable<Indicador>>
    private _pesquisaStrategy: RetrieveStrategy<Observable<Pesquisa>>
    private _resultadoStrategy: RetrieveStrategy<Observable<Resultado>>


}

export class UnidadeIndicador {
    static getTipo(classe) {
        const tipos = {
            "$": "monetária",
            "%": "proporcional",
            "N": "numérica",
            "G": "genérica"
        }
        return tipos[classe];
    }

    nome: string
    classe: string
    tipo: string
    multiplicador: number

    constructor({
        id = '',
        classe = 'G',
        multiplicador = 1
    }) {
        this.nome = id;
        this.classe = classe;
        this.tipo = UnidadeIndicador.getTipo(classe)
        this.multiplicador = multiplicador;
    }

    toString() {
        return this.multiplicador === 1
            ? `${this.nome}`
            : `${this.nome} (${this.multiplicador})`;
    }
}

export class MetadadoIndicador {
    descricao: string
    calculo: string

    constructor({
        descricao = '',
        calculo = ''
    }) {
        this.descricao = descricao;
        this.calculo = calculo;
    }
}
