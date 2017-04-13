import { Injectable } from '@angular/core';

import { Localidade } from './localidade.interface';
import { municipios } from '../../../api/municipios';
import { ufs } from '../../../api/ufs';
import { brasil } from '../../../api/brasil';

import { RouterParamsService } from '../router-params.service';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

class LocalidadeCache {
    private _list = <Localidade[]>[];
    private _codigo = <{ [idx: number]: Localidade }>{};
    private _identificador = <{ [idx: string]: Localidade[] }>{};

    get todos() {
        return this._list;
    }

    buscarPorIdentificador(identificador: string) {
        return this._identificador[identificador];
    }

    buscarPorCodigo(codigo: number) {
        return this._codigo[codigo];
    }

    registerElement(localidade: Localidade) {
        if (!this._codigo[localidade.codigo]) {
            this._list.push(localidade);
            this._codigo[localidade.codigo] = localidade;
            if (!this._identificador[localidade.identificador]) {
                this._identificador[localidade.identificador] = [];
            }
            this._identificador[localidade.identificador].push(localidade);
        }
    }
}

@Injectable()
export class LocalidadeService {

    static criarPais = (obj) => new Localidade(Object.assign({ tipo: 'pais' }, obj));
    static criarUF = (obj) => new Localidade(Object.assign({ tipo: 'uf' }, obj));
    static criarMunicipio = (obj) => new Localidade(Object.assign({ tipo: 'municipio' }, obj));

    private _brasil: Localidade;
    private _municipios = new LocalidadeCache();
    private _ufs = new LocalidadeCache();
    private _linkCache = <{ [idx: number]: string }>{};

    public tree$: ReplaySubject<any>;
    public selecionada$: Observable<Localidade>;

    constructor(
        private _params: RouterParamsService
    ) {
        this._buildLocalidadesTree();

        this.tree$ = new ReplaySubject<any>();

        this._params.params$
            .map(({params}) => ({ uf: params['uf'], municipio: params['municipio'] }))
            .map(slugs => {
                let uf = this.getUfBySigla(slugs.uf);
                let mun = this.getMunicipioBySlug(slugs.uf, slugs.municipio);

                return [this._brasil, uf, mun].filter(value => !!value);
            })
            .subscribe(tree => this.tree$.next(tree));

        this.selecionada$ = this.tree$.map(tree => tree[tree.length - 1]);
    }

    public getRoot(): Localidade {
        return this._brasil;
    }

    public getUfs(): Localidade[] {
        return this.getRoot().children;
    }

    public getUfByCodigo(ufCodigo: number) {
        if (!ufCodigo) return;
        return this._ufs.buscarPorCodigo(ufCodigo);
    }

    public getUfBySigla(ufSigla) {
        if (!ufSigla) return;
        return this._ufs.buscarPorIdentificador(ufSigla)[0];
    }

    public getAllMunicipios() {
        return this._municipios.todos;
    }

    public getMunicipios(identificador): Localidade[] {
        if (Number.isNaN(parseInt(identificador, 10))) {
            return this.getUfBySigla(identificador).children;
        }

        return this.getUfByCodigo(identificador).children;
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

    // TODO: Refatorar esse método, está consumindo cerca de 0,6 segundos no processamento + 0,3 segundos
    private _buildLocalidadesTree() {
        this._brasil = LocalidadeService.criarPais(brasil);

        ufs.forEach(uf => {
            let _uf = LocalidadeService.criarUF(Object.assign({ parent: this._brasil }, uf));
            this._brasil.registerChildren(_uf);
            this._ufs.registerElement(_uf);
        });

        municipios.forEach(municipio => {
            let uf = this.getUfByCodigo(municipio.codigoUf);
            let _mun = LocalidadeService.criarMunicipio(Object.assign({ parent: uf }, municipio));
            uf.registerChildren(_mun);
            this._municipios.registerElement(_mun);
        });

        ufs.forEach(uf => {
            let _uf = this.getUfByCodigo(uf.codigo);
            let _mun = this.getMunicipioByCodigo(uf.codigoCapital.toString().slice(0,6));
            _uf.capital = _mun;
        });

    }

}