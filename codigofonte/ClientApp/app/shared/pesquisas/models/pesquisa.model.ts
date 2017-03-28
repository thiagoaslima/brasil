import { EscopoIndicadores } from '../configuration/servidor.configuration'
import { PeriodoServer, PesquisaServer } from './server.interfaces';
import { Indicador } from './indicador.model';
import { RetrieveStrategy, StateStrategyManager } from '../strategies/strategy.interface'

import { Observable } from 'rxjs/Observable';


/**
 * Pequisa
 * 
 * @export
 * @class Pesquisa
 */
export class Pesquisa {

    /**
     * is
     * @description Testa se o objeto é uma instância de Pesquisa
     * 
     * @static
     * @param {object} obj 
     * @returns boolean
     * 
     * @memberOf Pesquisa
     */
    static is(obj: Object) {
        return obj instanceof Pesquisa;
    }

    /**
     * setStrategy
     * @description Registra o método de recuperação da lista de indicadores
     * 
     * @static
     * @param {RetrieveStrategy<Observable<Indicador[]>>} strategy 
     * 
     * @memberOf Pesquisa
     */
    static setStrategy(strategy: RetrieveStrategy<Observable<Indicador[]>>) {
        Pesquisa.prototype._getIndicadoresFilhosStrategy = strategy;
    }

    readonly id: number
    readonly nome: string
    readonly descricao: string
    readonly observacao: string
    readonly periodos: Periodo[]
    readonly contexto: Contexto
    private _indicadores: Indicador[];

    /**
     * indicadores
     * @description lista de indicadores {@link Indicador} (primeiro nivel)
     * assíncrono
     * 
     * @readonly
     * @type {Observable<Indicador[]>}
     * @memberOf Pesquisa
     */
    get indicadores(): Observable<Indicador[]> {
        if (this._indicadores) {
            return Observable.of(this._indicadores);
        }

        if (!this._getIndicadoresFilhosStrategy) {
            throw new ReferenceError('No getIndicadoresFilhos strategy registered')
        }

        if (!this._states.indicadores) {
            this._states.indicadores = this._getIndicadoresFilhosStrategy.retrieve(this.id)
                .do(indicadores => this._indicadores = indicadores)
                .share();
        }

        return this._states.indicadores;
    }

    /**
     * getListaPeriodos
     * @description Retorna a lista com o nome de todos os periodos {@link Periodo#nome} da pesquisa
     * 
     * @returns string[]
     * 
     * @memberOf Pesquisa
     */
    getListaPeriodos() {
        return this.periodos.map(periodo => periodo.nome);
    }

    
    /**
     * getListaContextos
     * @description Retorna a lista com o nome de todos os periodos {@link Periodo#nome} da pesquisa
     * 
     * @returns {string[]} 
     * 
     * @memberOf Pesquisa
     */
    getListaContextos(): string[] {
        return Object.keys(this.contexto).filter(nivel => !!this.contexto[nivel]);
    }


    /**
     * getAllIndicadores
     * @description retorna toda a árvore de indicadores da Pesquisa, já com os respectivos resultados para as localidades solicitadas
     * 
     * @param {(number | number[] | string)} [codigoLocalidade] 
     * @returns {Observable<Indicador[]>} 
     * 
     * @memberOf Pesquisa
     */
    getAllIndicadores(codigoLocalidade?: number | number[] | string): Observable<Indicador[]>{
        const localidade = Array.isArray(codigoLocalidade) ? codigoLocalidade.join(',') : codigoLocalidade;
        return this._getAllIndicadoresStrategy.retrieve(this.id, "0", localidade, EscopoIndicadores.arvore);
    }


    /**
     * getResultados
     * @description retorna os indicadores filhos da Pesquisa, com os respectivos resultados
     * 
     * @param {(number | number[] | string)} [codigoLocalidade] 
     * @returns {Observable<Indicador[]>} 
     * 
     * @memberOf Pesquisa
     */
    getResultados(codigoLocalidade?: number | number[] | string): Observable<Indicador[]>{
        const localidade = Array.isArray(codigoLocalidade) ? codigoLocalidade.join(',') : codigoLocalidade;
        return this._getAllIndicadoresStrategy.retrieve(this.id, "0", localidade, EscopoIndicadores.filhos);
    }

    constructor(pesquisaServer: PesquisaServer) {
        const _defaults = Object.assign({
            id: 0,
            nome: '',
            descricao: '',
            observacao: '',
            periodos: [],
            contexto: 0,
            indicadores: null
        }, pesquisaServer);

        this.id = _defaults.id;
        this.nome = _defaults.nome;
        this.descricao = _defaults.descricao || '';
        this.observacao = _defaults.observacao || '';
        this.periodos = _defaults.periodos.map(periodo => new Periodo(periodo));
        this.contexto = new Contexto(_defaults.contexto || 0);
        this._indicadores = _defaults.indicadores;
    }

    private _getIndicadoresFilhosStrategy: RetrieveStrategy<Observable<Indicador[]>>
    private _getAllIndicadoresStrategy: RetrieveStrategy<Observable<Indicador[]>>
    private _states = {
        indicadores: null,
        allIndicadores: null
    }
}


/**
 * Periodo
 * @description Contém dados temporais de uma Pesquisa
 * 
 * @export
 * 
 * @class Periodo
 */
export class Periodo {
    nome: string;
    publicacao: Date | null;
    fontes: string[];
    notas: string[];

    constructor(periodoServer: PeriodoServer) {
        const _defaults = Object.assign({
            periodo: '',
            publicacao: null,
            fonte: [],
            nota: []
        }, periodoServer);

        this.nome = _defaults.periodo;
        this.fontes = _defaults.fonte;
        this.notas = _defaults.nota;

        if (_defaults.publicacao) {
            const [data, horario] = _defaults.publicacao.split(' ');
            const [dia, mes, ano] = data.split('/');
            const [hora, minuto, segundo] = horario.split(':');
            this.publicacao = new Date(ano, mes, dia, hora, minuto, segundo);
        } else {
            this.publicacao = null;
        }
    }
}


/**
 * Contexto
 * @description Define os níveis territoriais cobertos por uma Pesquisa
 * 
 * @export
 * @class Contexto
 */
export class Contexto {
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
            this[propertyName] = !!contextos[index];
        });
    }
}
