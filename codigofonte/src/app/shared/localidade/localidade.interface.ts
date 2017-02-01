import { OpaqueToken } from '@angular/core';
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

export class Pais {
    codigo: number;
    nome: string;
    slug: string;
    link: string;
    ufs: UF[]

    constructor({
        codigo,
        nome,
        slug,
        link,
        ufs
    }) {
        this.codigo = codigo;
        this.nome = nome;
        this.slug = slug;
        this.link
    }

    registerUf(uf: UF) {
        if (this.ufs.every(_uf => _uf.codigo !== uf.codigo)) {
            this.ufs.push(uf);
            this.ufs.sort((a, b) => a.slug < b.slug ? 1 : -1);
        }
    }
}

export class Localidade {
    codigo: number;
    nome: string;
    tipo: 'pais' | 'uf' | 'municipio';
    slug: string;
    sigla: string;
    capital: Localidade;
    parent: Localidade;
    private _childrenList: Localidade[] = [];
    private _link: string = '';

    get identificador() {
        return this.sigla ? this.sigla.toLowerCase() : this.slug;
    }

    get link() {
        if (!this._link) {
            this._link = this.parent ? this.parent.link + this.identificador : this.identificador;
        }
        return this._link;
    }

    get children() {
        return this._childrenList;
    }

    constructor({
        codigo,
        nome,
        tipo,
        sigla = '',
        capital = null,
        parent = null
    }) { 
        this.codigo = codigo;
        this.nome = nome;
        this.tipo = tipo;
        this.sigla = sigla;
        this.capital = capital;
        this.parent = parent;
        this.slug = slugify(nome);
    }

    registerChildren(children: Localidade|Localidade[]) {
        children = Array.isArray(children) ? children : [children];

        const includes = children.filter(child => {
            if (this._childrenList.some(_child => _child.codigo === child.codigo)) {
                return false;
            }
            this._childrenList.push(child);
        })

        this._childrenList.sort( (a,b) => a.slug < b.slug ? 1 : -1);
    }
}