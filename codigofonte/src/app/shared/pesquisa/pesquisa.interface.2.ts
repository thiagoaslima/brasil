import { Injectable } from '@angular/core';

import { SystemCacheService } from '../system-cache.service';
import { RetrieveStrategy } from './pesquisa-strategies';
import { flatTree, flatMap } from '../../utils/flatFunctions';
import { range } from '../../utils/range';

import { Observable } from 'rxjs/Observable';

/** 
 * @description Datas que a pesquisa foi feita
 * @property {string} periodo Época da pesquisa. Pode ser um ano, um semestre, uma série de de anos
 * @property {Date} publicacao data de publicação da pesquisa em determinado período
 * @property {string[]} fonte fonte da publicação
 * * @property {string[]} nota nota da publicação
 */
export class Periodo {
    periodo: string;
    publicacao: Date;
    fonte: string[];
    nota: string[];
}

/** 
 * @description Descreve os níveis territoriais que uma pesquisa abrange
 * @property {boolean} pais dados para País (Brasil)
 * @property {boolean} macrorregião dados para Macrorregiões (N, NE, SE, S, CO)
 * @property {boolean} uf dados para unidades federativas 
 * @property {boolean} ufSub dados para subregiões de uma unidade federativa (Microrregião, região metropolitana etc)
 * @property {boolean} uf dados para municípios
 * @property {boolean} municipio dados para subregiões de um municipio 
 */
class Contexto {
    pais
    macrorregiao
    uf
    ufSub
    municipio
    municipioSub

    constructor(binario: number) {
        let contextos = binario.toString()
            .split('')
            .reverse()
            .map(str => Number.parseInt(str));

        let len = contextos.length;
        contextos.length = 6;
        contextos.fill(0, len);
        [
            'pais',
            'macrorregiao',
            'uf',
            'ufSub',
            'municipio',
            'municipioSub'
        ].forEach((propertyName, index) => {
            this[propertyName] = !!contextos[index]
        });
    }
}


/** 
 * @description Pesquisa
 * @external {SystemCacheService} _cache
 */
export class Pesquisa {
    /**
     * Verifica se um objeto é uma instância de Pesquisa
     */
    static is(obj) {
        return obj instanceof this;
    }

    /**
     * Configura o método de recuperação dos indicadores pela Pesquisa
     */
    static setStrategy(strategy) {
        Pesquisa.prototype._strategy = strategy;
    }

    id: number
    nome: string
    descricao: string
    observacao: string
    periodos: Periodo[]
    contexto: Contexto
    private _indicadoresRoot: number[]
    private _strategy: RetrieveStrategy<Indicador[]> = { retrieve: (ids) => { throw new Error('No strategy was registred') } };

    /**
     * Retorna os indicadores de primeira posicao da pesquisa
     * @returns {Indicador[]}
     */
    get indicadores() {
        return this._strategy.retrieve(this._indicadoresRoot);
    }

    /**
     * Retorna os periodos {@link Periodo#periodo} da pesquisa
     * @returns {string[]} Os períodos da pesquisa
     */
    getPeriodos() {
        return this.periodos.map(periodo => periodo.periodo);
    }

    constructor(
        obj = {
            id: 0,
            nome: '',
            descricao: '',
            observacao: '',
            periodos: [],
            contexto: 0,
            indicadoresRoot: []
        }) {
        this.id = obj.id;
        this.nome = obj.nome;
        this.descricao = obj.descricao;
        this.observacao = obj.observacao;
        this.periodos = obj.periodos;
        this.contexto = new Contexto(obj.contexto);
        this._indicadoresRoot = obj.indicadoresRoot;
    }

    /**
     * Grava a id dos indicadores de nivel mais elevado dentro da pesquisa
     */
    registerIndicadores(ids: Array<number | Indicador>) {
        let _ids = ids.map((id: number | Indicador) => {
            return Indicador.is(id) ? id['id'] : id;
        });
        this._indicadoresRoot = this._indicadoresRoot.concat(_ids).filter((id, idx, arr) => arr.indexOf(id) === idx);
    }
}

class UnidadeIndicador {
    id: string
    classe: string
    multiplicador: number

    constructor({
        id = '',
        classe = '',
        multiplicador = 1
    }) {
        this.id = id;
        this.classe = classe;
        this.multiplicador = multiplicador;
    }
}

class MetadadoIndicador {
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

export class Indicador {
    /**
     * Verifica se um objeto é uma instância de Indicador
     */
    static is(obj) {
        return obj instanceof this;
    }

    /**
     * Configura o método de recuperação da pesquisa a qual o indicador pertence
     */
    static setPesquisaStrategy(strategy: RetrieveStrategy<Pesquisa>) {
        this.prototype._pesquisaStrategy = strategy;
    }

    /**
     * Configura o método de recuperação dos indicadores filhos
     */
    static setIndicadoresStrategy(singularStrategy: RetrieveStrategy<Indicador>, multipleStrategy: RetrieveStrategy<Indicador[]>) {
        this.prototype._indicadoresStrategy = {
            retrieve: (ids: number | number[], pesquisaId: number) => {
                if (Array.isArray(ids)) {
                    return multipleStrategy.retrieve(ids, pesquisaId);
                }
                return singularStrategy.retrieve(ids, pesquisaId);
            }
        }
    }

    static setResultadosStrategy(strategy: RetrieveStrategy<Observable<ResultadosIndicador>>) {
        this.prototype._resultadosStrategy = strategy;
    }

    id: number
    posicao: string
    indicador: string
    pesquisaId: number
    classe: string
    unidade: UnidadeIndicador
    nota: any[]
    metadado: {

    }

    private _parentId: number
    private _children: number[]
    private _pesquisaStrategy: RetrieveStrategy<Pesquisa> = { retrieve: (ids) => { throw new Error('No pesquisaStrategy was registred') } };
    private _indicadoresStrategy: RetrieveStrategy<Indicador | Indicador[]> = { retrieve: (ids) => { throw new Error('No indicadoresStrategy was registred') } };
    private _resultadosStrategy: RetrieveStrategy<Observable<ResultadosIndicador>> = { retrieve: (ids) => { throw new Error('No resultadosStrategy was registred') } };

    get nome() {
        return this.indicador;
    }

    get children() {
        return this._indicadoresStrategy.retrieve(this._children);
    }

    get parent() {
        if (this._parentId === 0) { return null; }
        return this._indicadoresStrategy.retrieve(this._parentId);
    }

    get pesquisa() {
        return this._pesquisaStrategy.retrieve(this.pesquisaId);
    }

    get resultados() {
        return this._resultadosStrategy.retrieve(this);
    }

    constructor(obj = {
        id: 0,
        posicao: '',
        indicador: '',
        classe: '',
        unidade: {},
        nota: [],
        metadado: {
            descricao: '',
            calculo: ''
        },
        children: [],
        pesquisa: null,
        parent: null
    }) {
        this.id = obj.id;
        this.posicao = obj.posicao;
        this.indicador = obj.indicador;
        this.classe = obj.classe;
        this.unidade = new UnidadeIndicador(obj.unidade);
        this.metadado = new MetadadoIndicador(obj.metadado);

        if (obj.children.length) this.registerChildren(obj.children);
        if (obj.pesquisa) this.registerPesquisa(obj.pesquisa);
        if (obj.parent) this.registerParent(obj.parent);
    }

    getResultados(codigosLocalidade: number | number[], periodos: string|string[] = 'all') {
        let _codigosLocalidade = Array.isArray(codigosLocalidade) ? codigosLocalidade : [codigosLocalidade];
        let resultados$ = this._resultadosStrategy.retrieve(this, _codigosLocalidade);

        if (periodos === 'all') {
            return resultados$.map(resultados => {
                return _codigosLocalidade.reduce((obj, codigo) => {
                    obj.resultados[codigo] = resultados[codigo];
                    return obj;
                }, <ResultadosIndicador>{id: this.id, resultados: {}});
            });
        } else {
            let _periodos = Array.isArray(periodos) ? periodos.map(periodo => periodo.toString()) : [periodos.toString()];
            _periodos = flatMap(_periodos, (periodo) => {
                if (periodo.toString().indexOf(':') === -1) {
                    return [periodo];
                }
                let [start, end] = periodo.toString().split(':');
                return range(start, end).map(n => n.toString());
            });

            return resultados$.map(resultados => {
                return _codigosLocalidade.reduce((obj, codigo) => {
                    obj.resultados[codigo] = _periodos.reduce((obj, periodo) => {
                        obj[periodo] = resultados[codigo][periodo];
                        return obj;
                    }, {});
                    return obj;
                }, <ResultadosIndicador>{id: this.id, resultados: {}});
            });
        }
    }

    latestResult(codigoLocalidade: number, start = -1, size = 1) {
        let periodos = this.pesquisa.getPeriodos().slice(start, size);
        return this.getResultados(codigoLocalidade, periodos).map(resultados => {
            return {
                periodos,
                resultados
            };
        });
    }

    registerChildren(children: number | Indicador | Array<number | Indicador>): void {
        children = Array.isArray(children) ? children : [children];

        let _children: number[] = children.map(child => {
            return Indicador.is(child) ? child['id'] : child;
        });

        this._children = this._children.concat(_children).filter((id, idx, arr) => arr.indexOf(id) === idx);
    }

    registerPesquisa(pesquisa: number | Pesquisa) {
        this.pesquisaId = Pesquisa.is(pesquisa) ? pesquisa['id'] : pesquisa
    }

    registerParent(parent: number | Indicador) {
        this._parentId = Indicador.is(parent) ? parent['id'] : parent;
    }
}

export class ResultadosServer {
    id: number
    res: {
        localidade: string
        res: { [periodo: string]: string }
    }[]
}

export interface ResultadosIndicador {
    id: number
    resultados: {
        [codigoLocalidade: number]: {
            [periodo: string]: string
        }
    }
}


