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

    getPeriodosValues() {
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
    resultados: Resultado[]
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
        this.pesquisa = obj.pesquisa;
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

    getResultados(localidadesCodigo: number | number[], periodos: number | string | Array<number | string> = 'all') {
        let _localidadesCodigo = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        let localidadeFilter = _localidadesCodigo.length ? (localidade) => _localidadesCodigo.indexOf(localidade.codigo) > -1 : null;

        let _periodos = [];
        if (periodos === 'all') {
            _periodos = this.pesquisa.getPeriodosValues();
        } else {
            _periodos = Array.isArray(periodos) ? periodos.map(periodo => periodo.toString()) : [periodos.toString()];
            _periodos = flatMap(_periodos, (periodo) => {
                if (periodo.toString().indexOf('-') === -1) {
                    return [periodo];
                }
                let [start, end] = periodo.toString().split('-');
                return range(start, end).map(n => n.toString());
            });
        }

        let res = _localidadesCodigo.length > 0 ? this.resultados.filter(obj => _localidadesCodigo.indexOf(parseInt(obj.localidade, 10)) > -1) : this.resultados;

        return res.reduce((agg, obj) => {
            let key = obj.localidade;
            agg.valores[key] = _periodos.map(periodo => obj.res[periodo]);
            return agg;
        }, { periodos: _periodos, valores: <{ [idx: string]: string[] }>{} });

    }


    saveResultados(resultados: Resultado[]) {
        resultados.forEach(resultado => {
            let _res = this.resultados.filter(_res => _res.localidade === resultado.localidade)[0];

            if (!_res) {
                let obj: Resultado = { localidade: resultado.localidade, res: {} };
                this.resultados.push(obj);
                _res = obj;
            }

            Object.keys(resultado.res).forEach(key => {
                _res[key] = resultado.res[key];
            });
        });
        return this;
    }
}

export class Resultado {
    localidade: string
    res: { [ano: string]: string }

}