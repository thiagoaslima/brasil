import { Pesquisa } from '../pesquisa/pesquisa.model';
import { Resultado } from '../resultado/resultado.model';
import { Validador } from '../../utils/validador.class';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';

const _defaults = {
    id: 0,
    nome: '',
    posicao: '',
    classe: '',
    unidade: null,
    notas: [],
    metadados: [],
    pesquisaId: 0
};

export const EscopoIndicadores = {
    proprio: 'base',
    filhos: 'one',
    arvore: 'sub'
}

const indicadorValidador = new Validador();
indicadorValidador.resgitrarTestes([
    {
        propriedade: 'id',
        mensagemErro: 'valor de id inválido',
        funcaoTeste: (data) => data.id > 0
    },

    {
        propriedade: 'nome',
        mensagemErro: 'valor de nome inválido',
        funcaoTeste: (data) => !!data.nome
    }
])

export class Indicador {

    static indicadoresStrategy = null;
    static get(pesquisaId: number, posicao: string): Observable<Indicador> {
        if (!Indicador.indicadoresStrategy) {
            throw new ReferenceError('indicadoresStrategy não foi definida em Indicador')
        }
        return Indicador.indicadoresStrategy.retrieve(pesquisaId, posicao, EscopoIndicadores.proprio)
            .map(indicadores => indicadores[0]);
    }

    static getFilhos(pesquisaId: number, posicao: string): Observable<Indicador[]> {
        if (!Indicador.indicadoresStrategy) {
            throw new ReferenceError('indicadoresStrategy não foi definida em Indicador')
        }
        return Indicador.indicadoresStrategy.retrieve(pesquisaId, posicao, EscopoIndicadores.filhos)
    }

    static getArvore(pesquisaId: number, posicao: string): Observable<Indicador[]> {
        if (!Indicador.indicadoresStrategy) {
            throw new ReferenceError('indicadoresStrategy não foi definida em Indicador')
        }
        return Indicador.indicadoresStrategy.retrieve(pesquisaId, posicao, EscopoIndicadores.arvore)
    }

    static converter(data) {
        data = Object.assign({}, data, {
            nome: data.indicador,
            metadados: data.metadado
        });
        delete (data.indicador);
        delete (data.metadado);
        return data;
    }

    static criar(data, validador = indicadorValidador) {
        return validador.validar(data, (data) => new Indicador(Object.assign(data, {
            unidade: UnidadeIndicador.criar(UnidadeIndicador.converter(data.unidade)),
            metadados: Metadado.criar(data.metadado)
        })));
    }

    static setIndicadoresStrategy(strategy) {
        Indicador.indicadoresStrategy = strategy;
    }

    public readonly id: number;
    public readonly nome: string;
    public readonly posicao: string;
    public readonly classe: string;
    public readonly unidade: UnidadeIndicador
    public readonly notas: string[]
    public readonly metadados: Metadado
    public readonly pesquisaId: number
    // public readonly indicadorPai 
    // public readonly indicadores
    // public readonly pesquisa

    private _indicadorPai: Observable<Indicador>;
    get indicadorPai() {
        if (this._indicadorPai === undefined) {
            const posicao = this.posicao.split('.').slice(0, -1).join('.');

            this._indicadorPai = posicao
                ? Indicador.get(this.pesquisaId, posicao).do(indicador => this._indicadorPai = Observable.of(indicador)).share()
                : Observable.of(null);
        }

        return this._indicadorPai;
    }

    private _indicadores: Observable<Indicador[]>;
    get indicadores() {
        if (!this._indicadores) {
            this._indicadores = Indicador.getFilhos(this.pesquisaId, this.posicao)
                .do(indicadores => this.registerFilhos(indicadores))
                .share();
        }
        return this._indicadores;
    }

    private _pesquisa: Observable<Pesquisa>;
    get pesquisa() {
        if (this._pesquisa === undefined) {
            this._pesquisa = Pesquisa.get(this.pesquisaId)
                .do(pesquisa => this.registerPesquisa(pesquisa))
                .share();
        }

        return this._pesquisa;
    }

    constructor(data) {
        data = Object.assign({}, _defaults, data);
        Object.keys(_defaults).forEach(property => {
            this[property] = data[property];
        });

        if (data.res) {
            const array = Resultado.converterFromIndicadorBody(this.id, data.res);
            const resultados = array.map(obj => Resultado.criar(obj))
            this.registerResultados(resultados);
        }
    }

    private _resultados: {[codigoLocalidade: number]: Observable<Resultado>} = Object.create(null);
    getResultadoByLocal(codigoLocalidade: number): Observable<Resultado> {
        if (!this._resultados[codigoLocalidade]) {
            this._resultados[codigoLocalidade] = Resultado.get(this.pesquisaId, this.posicao.toString(), codigoLocalidade)
                .do(resultado => this._resultados[codigoLocalidade] = Observable.of(resultado))
                .share();
        }
        return this._resultados[codigoLocalidade];
    }

    registerPesquisa(pesquisa: Pesquisa) {
        this._pesquisa = Observable.of(pesquisa);
    }

    registerResultado(resultado: Resultado) {
        this._resultados[resultado.localidadeCodigo] = Observable.of(resultado);       
    }

    registerResultados(resultados: Resultado[]) {
        resultados.forEach(resultado => this.registerResultado(resultado));
    }

    registerIndicadorPai(indicador: Indicador) {
        this._indicadorPai = Observable.of(indicador);
    }

    registerFilhos(indicadores: Indicador[]) {
        this._indicadores = Observable.of(indicadores);
    }
}




// UNIDADE INDICADOR
// ======================================
const _unidadeDefaults = {
    nome: '',
    classe: 'G',
    multiplicador: 1
};

const _unidadeTiposPossiveis = {
    "$": "monetária",
    "%": "proporcional",
    "N": "numérica",
    "G": "genérica"
}

export class UnidadeIndicador {
    static converter(data) {
        if (!data) {
            return _unidadeDefaults;
        }
        return {
            nome: data.id,
            classe: data.classe,
            multiplicador: data.multiplicador
        }
    }

    static criar(data: Object) {
        return new UnidadeIndicador(data);
    }

    static getTipo(classe: string) {
        return _unidadeTiposPossiveis[classe];
    }

    nome: string
    classe: string
    tipo: string
    multiplicador: number

    constructor(data) {
        data = Object.assign({}, _unidadeDefaults, data);
        this.nome = data.nome;
        this.classe = data.classe;
        this.tipo = UnidadeIndicador.getTipo(data.classe)
        this.multiplicador = data.multiplicador;
    }

    toString() {
        return this.multiplicador === 1
            ? `${this.nome}`
            : `${this.nome} (${this.multiplicador})`;
    }
}




// METADADOS
// ======================================
const _metadadosDefaults = {
    descricao: '',
    calculo: ''
}

export class Metadado {

    static criar(data) {
        return new Metadado(data);
    }

    descricao: string
    calculo: string

    constructor(data) {
        data = Object.assign({}, _metadadosDefaults, data);
        this.descricao = data.descricao;
        this.calculo = data.calculo;
    }
}