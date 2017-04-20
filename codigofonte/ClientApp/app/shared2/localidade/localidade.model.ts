import { Validador } from '../../utils/validador.class';
import { slugify } from '../../utils/slug';


export type NivelTerritorial = {
    label: string,
    codeLength: number
};

export const NiveisTerritoriais = {
    pais: {
        label: "pais",
        codeLength: 0
    },
    macrorregiao: {
        label: "macrorregiao",
        codeLength: 1
    },
    uf: {
        label: "uf",
        codeLength: 2
    },
    municipio: {
        label: "municipio",
        codeLength: 6
    }
}

const tiposPossiveisLocalidade = {
    "1": 'pais',
    "2": 'uf',
    "6": 'municipio'
};

const _localidadeDefaults = {
    codigo: null,
    codigoCompleto: null,
    digitoVerificador: null,
    nome: "",
    tipo: "",
    slug: "",
    sigla: "",
    codigoCapital: null,
    codigoParent: null
};

const localidadeValidador = new Validador();
localidadeValidador.resgitrarTestes([
    {
        propriedade: 'codigo',
        mensagemErro: 'valor de codigo da localidade inválido',
        funcaoTeste: (data) => Number.isInteger(data.codigo)
    }
])

export class Localidade {

    static localidadeStrategy = null;
    static get(codigo: number): Localidade {
        return Localidade.localidadeStrategy.retrieve(codigo, 'proprio')[0];
    }

    static getFilhos(codigo: number): Localidade[] {
        return Localidade.localidadeStrategy.retrieve(codigo, 'filhos');
    }

    static criar(data, validador = localidadeValidador) {
        return localidadeValidador.validar(data, (data) => new Localidade(data));
    }

    static getTipo(codigo) {
        const len = codigo.toString().length;
        return tiposPossiveisLocalidade[len];
    }

    static convertFromFile(data) {
        const codigo = parseInt(data.codigo.toString().slice(0, 6), 10);
        const tipo = Localidade.getTipo(codigo)
        switch (tipo) {
            case tiposPossiveisLocalidade[1]:
                return Localidade.convertBrasil(data);

            case tiposPossiveisLocalidade[2]:
                return Localidade.convertFileUfs(data);

            case tiposPossiveisLocalidade[6]:
                return Localidade.convertFileMunicipios(data);

            default:
                break;
        }
    }
    
    // 340ms 700ms
    //  63ms 388ms
    static convertBrasil(data) {
        return {
            codigo: data.codigo,
            codigoCompleto: data.codigo,
            digitoVerificador: null,
            nome: data.nome,
            tipo: tiposPossiveisLocalidade[1],
            slug: data.slug || slugify(data.nome),
            sigla: "",
            codigoCapital: parseInt(data.codigoCapital.toString().slice(0, 6), 10),
            codigoParent: null
        }
    }

    static convertFileUfs(data) {
        return {
            codigo: parseInt(data.codigo, 10),
            codigoCompleto: parseInt(data.codigo, 10),
            digitoVerificador: null,
            nome: data.nome,
            tipo: tiposPossiveisLocalidade[2],
            slug: data.slug || slugify(data.nome),
            sigla: data.sigla.toUpperCase(),
            codigoCapital: parseInt(data.codigoCapital.toString().slice(0, 6), 10),
            codigoParent: 0
        }
    }

    static convertFileMunicipios(data) {
        return {
            codigo: parseInt(data.codigo.toString().slice(0, 6), 10),
            codigoCompleto: parseInt(data.codigo, 10),
            digitoVerificador: parseInt(data.codigo.toString().slice(6), 10),
            nome: data.nome,
            tipo: tiposPossiveisLocalidade[6],
            sigla: "",
            slug: data.slug || slugify(data.nome),
            codigoCapital: null,
            codigoParent: parseInt(data.codigoUf, 10)
        }
    }

    static setLocalidadeStrategy(strategy) {
        Localidade.localidadeStrategy = strategy;
    }

    static alterarContexto(codigoBase: number, nivelTerritorial: NivelTerritorial ) {
        let codigo = codigoBase !== 0 ? codigoBase.toString().split('') : [];
		const len = codigo.length;
		codigo.length = nivelTerritorial.codeLength;
        codigo.fill('x', len);
        return codigo.join('');
    }

    codigo: number;
    codigoCompleto: number;
    digitoVerificador: number;

    nome: string;
    tipo: 'pais' | 'uf' | 'municipio';
    sigla: string;
    slug: string;
    codigoCapital: number;
    codigoParent: number;
    private _link: string = '';

    constructor(data) {
        data = Object.assign({}, _localidadeDefaults, data);
        Object.keys(_localidadeDefaults).forEach(property => {
            this[property] = data[property];
        });
    }

    get identificador() {
        return this.sigla ? this.sigla.toLowerCase() : this.slug;
    }

    get link() {
        if (!this._link) {
            this._link = this.parent ? this.parent.link + '/' + this.identificador : '/' + this.identificador;
        }
        return this._link;
    }

    get children() {
        return Localidade.getFilhos(this.codigo);
    }

    get parent() {
        return Localidade.get(this.codigoParent);
    }

    get capital() {
        if (this.codigoCapital) {
            return Localidade.get(this.codigoCapital)
        }
        return null;
    }

}