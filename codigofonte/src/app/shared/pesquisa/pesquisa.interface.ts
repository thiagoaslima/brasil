import { flatTree, flatMap } from '../../utils/flatFunctions';
import { range } from '../../utils/range';

export class Periodo {
    periodo: string;
    publicacao: Date;
    fonte: string[];
    nota: string[];
}

export class Pesquisa {
    id: number
    nome: string
    descricao: string
    observacao: string
    periodos: Periodo[]

    constructor({
        id,
        nome,
        descricao = '',
        observacao = '',
        periodos = []
    }) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.observacao = observacao;
        this.periodos = periodos;
    }

    getPeriodos() {
        return this.periodos.map(periodo => periodo.periodo);
    }
}


export class Indicador {
    static is(obj) {
        return obj instanceof Indicador;
    }

    id: number
    posicao: string
    indicador: string
    classe: string
    unidade: {
        id: string,
        class: string,
        multiplicador: number
    }
    children: Indicador[]
    nota: any[]
    metadado: {
        descricao: string,
        calculo: string
    }
    resultados: ResultadosIndicador
    pesquisa: Pesquisa
    parentId = 0;

    constructor(obj) {
        this.id = obj.id;
        this.posicao = obj.posicao;
        this.indicador = obj.indicador;
        this.classe = obj.classe;
        this.unidade = obj.unidade;
        this.nota = obj.nota || [];
        this.metadado = Object.assign({}, obj.metadado);
        this.pesquisa = obj.pesquisa instanceof Pesquisa ? obj.pesquisa : new Pesquisa(obj.pesquisa);
        this.parentId = obj.parentId || 0;

        if (obj.children && obj.children.length) {
            this.children = obj.children.map(child => {
                return Indicador.is(child) ? child : new Indicador(child);
            });
        } else {
            this.children = [];
        }

        this.resultados = obj.resultados || [];
    }

    registerChildren(children: Indicador | Indicador[]) {
        let _children = Array.isArray(children) ? children : [children];

        _children.forEach(child => {
            if (!Indicador.is(child)) {
                throw new Error(`#registerChildren must receive an Indicador intance`);
            }

            if (this.children.every(indicador => indicador.id !== child.id)) {
                this.children.push(child);
            }
        });

        return this;
    }

    getResultados(localidadesCodigo: number | number[], periodos: number | string | Array<number | string> = 'all'): ResultadosIndicador {
        /**
         * {
         *     codLocal: {
         *         ano: valor
         *     }
         * }
         */
        let _localidadesCodigo = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        let _periodos = [];

        if (periodos === 'all') {
            return _localidadesCodigo.reduce((obj, codigo) => {
                obj[codigo] = this.resultados[codigo];
                return obj;
            }, {});
        }

        _periodos = Array.isArray(periodos) ? periodos.map(periodo => periodo.toString()) : [periodos.toString()];
        _periodos = flatMap(_periodos, (periodo) => {
            if (periodo.toString().indexOf(':') === -1) {
                return [periodo];
            }
            let [start, end] = periodo.toString().split(':');
            return range(start, end).map(n => n.toString());
        });

        return _localidadesCodigo.reduce((obj, codigo) => {
            obj[codigo] = _periodos.reduce((obj, periodo) => {
                obj[periodo] = this.resultados[codigo][periodo];
                return obj;
            }, {});
            return obj;
        }, {});
    }

    latestResult(codigoLocalidade: number) {
        return this.pesquisa.getPeriodos().slice(-1).map(periodo => {
            let res = this.getResultados(codigoLocalidade, periodo)
            return {
                periodo,
                valor: res[codigoLocalidade][periodo]
            };
        })[0];
    }

    latestValidResult(codigoLocalidade: number) {
        let periodos = this.pesquisa.getPeriodos().reverse();
        let res = this.getResultados(codigoLocalidade);
        let i = 0, len = periodos.length;
        let ret = { periodo: '', valor: null };
        while (i < len) {
            if (res[codigoLocalidade][periodos[i]]) {
                ret = {
                    periodo: periodos[i],
                    valor: res[codigoLocalidade][periodos[i]]
                }
                break;
            }
            i++;
        }
        return ret;
    }

    saveResultados(resultados) {
        resultados.forEach(resultado => {
            let codigoLocalidade = resultado.localidade;

            if (!this.resultados[codigoLocalidade]) {
                this.resultados[codigoLocalidade] = {};
            }

            Object.assign(this.resultados[codigoLocalidade], resultado.res);
        });

        return this;
    }
}

export class ResultadoServer {
    id: string
    res: {
        localidade: string
        res: { [ano: string]: string }
    }
}

export interface ResultadosIndicador {
    [codigoLocalidade: string]: {
        [ano: string]: string
    }
}