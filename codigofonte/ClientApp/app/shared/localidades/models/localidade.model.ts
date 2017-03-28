import { slugify } from '../../../utils/slug';

export class Localidade {
    codigo: number;
    codigoCompleto: number;
    digitoVerificador: number;
        
    nome: string;
    tipo: 'pais' | 'uf' | 'municipio';
    slug: string;
    sigla: string;
    capital: Localidade | null;
    parent: Localidade | null;
    private _childrenList: Localidade[] = [];
    private _link: string = '';

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
        this.codigo = parseInt(codigo.toString().slice(0,6), 10);
        this.codigoCompleto = parseInt(codigo, 10);
        this.digitoVerificador = parseInt(codigo.toString().slice(6), 10) || null;
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

        this._childrenList.sort( (a,b) => a.slug < b.slug ? -1 : 1);
    }
}