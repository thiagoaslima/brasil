import { Indicador } from '../indicador/indicador.model';
import { Validador } from '../../utils/validador.class';

import { Observable } from 'rxjs/Observable';

const _pesquisaDefaults = {
    id: 0,
    nome: '',
    descricao: '',
    observacao: '',
    contexto: null,
    periodos: []
};

const pesquisaValidador = new Validador();
pesquisaValidador.resgitrarTestes([
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

export class Pesquisa {

    static pesquisaStrategy = null;
    static get(id: number): Observable<Pesquisa> {
        if (!Pesquisa.pesquisaStrategy) {
            throw new ReferenceError('pesquisaStrategy não foi definida em Pesquisa')
        }
        return Pesquisa.pesquisaStrategy.retrieve(id);
    }

    static criar(data, validador = pesquisaValidador): Pesquisa {
        return validador.validar(data, (data) => new Pesquisa(Object.assign(data, {
            contexto: Contexto.criar(data.contexto),
            periodos: data.periodos.map(periodo => Periodo.criar(Periodo.converter(periodo)))
        })));
    }

    static setPesquisaStrategy(strategy) {
        Pesquisa.pesquisaStrategy = strategy;
    }

    public readonly id: number
    public readonly nome: string
    public readonly descricao: string
    public readonly observacao: string
    public readonly contexto: Contexto
    public readonly periodos: Periodo[]

    private _indicadores: Observable<Indicador[]>
    getIndicadores(periodo: string = 'all') {

        periodo = !periodo ? 'all' : periodo;

        if (!this._indicadores) {
            this._indicadores = Indicador.getFilhos(this.id, '0', periodo)
                .do(indicadores => this._indicadores = Observable.of(indicadores))
                .share();
        }
        return this._indicadores;
    }

    constructor(data) {
        data = Object.assign({}, _pesquisaDefaults, data);
        Object.keys(_pesquisaDefaults).forEach(property => {
            this[property] = data[property];
        });
    }

    get indicadores(){

        return this.getIndicadores();
    }
}



// PERIODO 
// ===============================================

const periodoValidador = new Validador();
periodoValidador.resgitrarTestes([
    {
        propriedade: 'nome',
        mensagemErro: 'valor de nome inválido',
        funcaoTeste: (data) => Boolean(data.nome)
    }
]);
/**
 * Periodo
 * @description Contém dados temporais de uma Pesquisa
 * 
 * @export
 * 
 * @class Periodo
 */
export class Periodo {

    static converter(data) {
        return {
            nome: data.periodo,
            dataPublicacao: data.publicacao,
            fontes: data.fonte,
            notas: data.nota
        }
    }

    static criar(data, validador = periodoValidador) {
        return validador.validar(data, (data) => new Periodo(data));
    }

    nome: string;
    dataPublicacao: Date | null;
    fontes: string[];
    notas: string[];

    constructor(data) {
        const _defaults = Object.assign({
            nome: '',
            dataPublicacao: null,
            fontes: [],
            notas: []
        }, data);

        this.nome = _defaults.nome;
        this.fontes = _defaults.fontes;
        this.notas = _defaults.notas;

        if (_defaults.dataPublicacao) {
            const [data, horario] = _defaults.dataPublicacao.split(' ');
            const [dia, mes, ano] = data.split('/');
            const [hora, minuto, segundo] = horario.split(':');
            this.dataPublicacao = new Date(ano, mes, dia, hora, minuto, segundo);
        } else {
            this.dataPublicacao = null;
        }
    }
}



// CONTEXTO  
// ===============================================

/**
 * Contexto
 * @description Define os níveis territoriais cobertos por uma Pesquisa
 * 
 * @export
 * @class Contexto
 */
export class Contexto {

    static criar(data) {
        return new Contexto(data);
    }

    private _contextos = [
        'pais',
        'macrorregiao',
        'uf',
        'ufSub',
        'municipio',
        'municipioSub'
    ];

    pais
    macrorregiao
    uf
    ufSub
    municipio
    municipioSub

    constructor(binario: number) {
        let contextos = Boolean(binario)
            ? binario.toString()
                .split('')
                .reverse()
                .map(str => Number.parseInt(str))
            : [];

        let len = contextos.length;
        contextos.length = 6;
        contextos.fill(0, len).reverse();

        this._contextos.forEach((propertyName, index) => {
            this[propertyName] = !!contextos[index];
        });
    }

    getListaContextosValidos(): string[] {
        return this._contextos.filter(contexto => Boolean(this[contexto]));
    }
}
