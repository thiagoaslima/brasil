import { Injectable } from '@angular/core';

import { Indicador, EscopoIndicadores, Metadado, UnidadeIndicador } from '../indicador/indicador.model';
import { Localidade } from './localidade.model';
import { municipios } from '../../../api/municipios';
import { ufs } from '../../../api/ufs';
import { brasil } from '../../../api/brasil';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';


class LocalidadeCache {
    private _list = <Localidade[]>[];
    private _codigo = <{ [idx: number]: Localidade }>{};
    private _identificador = <{ [idx: string]: Localidade[] }>{};

    get todos() {
        return this._list.slice(0);
    }

    buscarPorIdentificador(identificador: string) {
        return this._identificador[identificador];
    }

    buscarPorCodigo(codigo: number) {
        return this._codigo[codigo];
    }

    registerElement(localidade: Localidade, group?: number) {

        if (!this._codigo[localidade.codigo]) {
            this._list.push(localidade);
            this._codigo[localidade.codigo] = localidade;
            if (!this._identificador[localidade.identificador]) {
                this._identificador[localidade.identificador] = [];
            }
            this._identificador[localidade.identificador].push(localidade);
        }

        if (Number.isInteger(group)) {
            const _group = group.toString();

            if (!this._identificador[_group]) {
                this._identificador[_group] = [];
            }
            
            this._identificador[_group].push(localidade);
        }
    }
}

@Injectable()
export class LocalidadeService {

    private _brasil: Localidade;
    private _municipios = new LocalidadeCache();
    private _ufs = new LocalidadeCache();

    constructor() {
        this._buildLocalidadesTree();
        Localidade.setLocalidadeStrategy({ retrieve: this.get.bind(this) });
    }

    get(codigo: number, escopo: 'proprio' | 'filhos' = 'proprio'): Localidade[] {
        if (codigo == undefined || codigo === null) { return [null];} 

        switch (codigo.toString().length) {
            case 1: // Brasil
                return escopo === 'proprio' ? [this.getRoot()] : this.getUfs();

            case 2: // UF
                const uf = this.getUfByCodigo(codigo);
                return escopo === 'proprio' ? [uf] : this._municipios.buscarPorIdentificador(uf.codigo.toString());

            case 6: // Municipio
                if (escopo === 'filhos') {
                    throw new Error('Municipio não tem filhos');
                }
                const municipio = this.getMunicipioByCodigo(codigo);
                return [municipio];

            default:
                return [];
        }
    }

    getChildren(codigo: number) {
        return this.get(codigo, 'filhos');
    }

    public getRoot(): Localidade {
        return this._brasil;
    }

    public getUfs(): Localidade[] {
        return this._ufs.todos;
    }

    public getUf(identificador): Localidade {
        if (Number.isNaN(parseInt(identificador, 10))) {
            return this.getUfBySigla(identificador);
        }
        return this.getUfByCodigo(identificador);
    }

    public getUfByCodigo(ufCodigo: number) {
        if (!ufCodigo) return;
        return this._ufs.buscarPorCodigo(ufCodigo);
    }

    public getUfBySigla(ufSigla: string) {
        if (!ufSigla) return;
        return this._ufs.buscarPorIdentificador(ufSigla)[0];
    }

    public getAllMunicipios() {
        return this._municipios.todos;
    }

    public getMunicipios(identificador): Localidade[] {
        const uf = this.getUf(identificador)
        return uf.children;
    }

    public getMunicipioBySlug(ufSigla, munSlug) {
        if (!ufSigla || !munSlug) return;
        let arr = this._municipios.buscarPorIdentificador(munSlug);
        return arr.reduce((agg, mun) => mun.parent.identificador === ufSigla ? mun : agg, null);
    }

    public getMunicipioByCodigo(munCodigo) {
        if (!munCodigo) return;
        return this._municipios.buscarPorCodigo(munCodigo);
    }

    private _buildLocalidadesTree() {
        this._brasil = Localidade.criar(Localidade.convertFromFile(brasil));

        ufs.forEach(uf => {
            let _uf = Localidade.criar(Localidade.convertFromFile(uf));;
            this._ufs.registerElement(_uf);
        });

        municipios.forEach(municipio => {
            let _mun = Localidade.criar(Localidade.convertFromFile(municipio));;
            this._municipios.registerElement(_mun, _mun.codigoParent);
        });
    }
}