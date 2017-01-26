import { slugify } from '../../utils/slug';

interface UFParams {
    codigo: number,
    codigoCapital: number,
    nome: string,
    sigla: string,
    slug?: string,
    municipios: Municipio[]
}

interface MunParams {
    codigo: number,
    codigoUf: number,
    siglaUf: string,
    nome: string,
    slug?: string,
}

export class UF {
    codigo: number;
    codigoCapital: number;
    nome: string;
    sigla: string;
    slug: string;
    link: string;

    capital: Municipio;
    municipios = <{
        lista: Municipio[],
        porSlug: { [idx: string]: Municipio },
        porCodigo: { [idx: string]: Municipio }
    }>{
        lista: [],
        porSlug: {},
        porCodigo: {}
    };

    constructor({
        codigo,
        codigoCapital,
        nome,
        sigla,
        slug,
        municipios
    }: UFParams) {
        this.codigo = codigo;
        this.codigoCapital = codigoCapital;
        this.nome = nome;
        this.sigla = sigla;
        this.slug = slug || slugify(nome);
        this.link = `brasil/${this.sigla.toLowerCase()}`;

        this.municipios.lista = municipios.sort((a, b) => a.slug < b.slug ? 1 : -1);

        municipios.forEach(mun => {
            if (mun.codigo === codigoCapital) {
                this.capital = mun;
            }
            this.municipios.porCodigo[mun.codigo] = mun;
            this.municipios.porSlug[mun.slug] = mun;
        });

        Object.freeze(this.municipios.lista);
        Object.freeze(this.municipios.porSlug);
        Object.freeze(this.municipios.porCodigo);
        Object.freeze(this.municipios);
        Object.freeze(this);
    }
}


export class Municipio {
    codigo: number;
    codigoUf: number;
    nome: string;
    slug: string;
    link: string;

    constructor({
        codigo,
        codigoUf,
        siglaUf,
        nome,
        slug
    }: MunParams) {
        this.codigo = codigo;
        this.codigoUf = codigoUf;
        this.nome = nome;
        this.slug = slug || slugify(nome);
        this.link = `brasil/${siglaUf.toLowerCase()}/${this.slug}`;

        Object.freeze(this);
    }
}

export interface IBrasil {
    codigo: number;
    nome: string,
    slug: string,
    link: string,
    ufs?: {
        lista: UF[],
        porSigla: { [idx: string]: UF },
        porCodigo: { [idx: number]: UF }
    }
}