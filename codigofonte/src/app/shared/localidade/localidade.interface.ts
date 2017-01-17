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
    nome: string,
    slug?: string
}

class UF {
    codigo: number;
    codigoCapital: number;
    nome: string;
    sigla: string;
    slug: string;

    capital: Municipio;
    municipios: Municipio[];

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
        Object.freeze(this);
     }
}


class Municipio {
    codigo: number;
    codigoUf: number;
    nome: string;
    slug: string;

    constructor({
        codigo,
        codigoUf,
        nome,
        slug
    }) {
        this.codigo = codigo;
        this.codigoUf = codigoUf;
        this.nome = nome;
        this.slug = slug || slugify(nome);
        Object.freeze(this);
    }
}