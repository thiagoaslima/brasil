import { Injectable } from '@angular/core';

import { IBrasil, Municipio, UF } from './localidade.interface';
import { municipios } from '../../../api/municipios';
import { ufs } from '../../../api/ufs';
import { brasil } from '../../../api/brasil';

import { RouterParamsService } from '../router-params.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class LocalidadeService {

    private _brasil: IBrasil;
    private _municipios = <Municipio[]>[];
    private _ufs = <UF[]>[];
    private _linkCache = <{ [idx: number]: string }>{};

    public tree$: Observable<any>;
    public selecionada$: Observable<IBrasil | UF | Municipio>;

    constructor(
        private _params: RouterParamsService
    ) {
        this._buildLocalidadesTree();

        this.tree$ = this._params.params$
            .map((params: { [idx: string]: string }) => ({ uf: params['uf'], municipio: params['municipio'] }))
            .map(slugs => {
                let uf = this.getUfBySigla(slugs.uf);
                let mun = this.getMunicipioBySlug(slugs.uf, slugs.municipio);

                return [this._brasil, uf, mun].filter(value => !!value);
            });

        this.selecionada$ = this.tree$.map(tree => tree[tree.length - 1]);
    }

    public getUfByCodigo(ufCodigo): UF {
        if (!ufCodigo) return;
        return this._getUf('codigo', ufCodigo);
    }

    public getUfBySigla(ufSigla): UF {
        if (!ufSigla) return;
        return this._getUf('sigla', ufSigla);
    }

    public getMunicipioBySlug(ufSigla, munSlug): Municipio {
        if (!ufSigla || !munSlug) return;
        return this._getMun('slug', ufSigla, munSlug);
    }

    public getRoot() {
        return this._brasil;
    }

    private _getUf(where, ufKey) {
        let prop = where === 'sigla' ? 'porSigla' : 'porCodigo';
        return this._brasil.ufs[prop][ufKey];
    }

    private _getMun(where, ufKey, munKey) {
        let munProp = where === 'slug' ? 'porSlug' : 'porCodigo';
        let ufProp = where === 'slug' ? 'porSigla' : 'porCodigo';
        return this._brasil.ufs[ufProp][ufKey].municipios[munProp][munKey];
    }

    private _buildLocalidadesTree() {
        this._brasil = Object.assign({}, brasil, {
            ufs: {
                lista: [],
                porSigla: {},
                porCodigo: {}
            },
            link: 'brasil'
        });

        let hashUfs = ufs.reduce((agg, uf) => {
            uf['municipios'] = [];
            agg[uf.codigo] = uf;
            return agg;
        }, {});

        // build all municipios and registers on uf
        municipios.forEach(mun => {
            let munParams = Object.assign({}, mun, { siglaUf: hashUfs[mun.codigoUf].sigla });
            let munObj = new Municipio(munParams);
            hashUfs[mun.codigoUf].municipios.push(munObj);
            this._municipios.push(munObj);
        });

        // build all ufs
        Object.keys(hashUfs).forEach(codigoUf => {
            let uf = new UF(hashUfs[codigoUf]);
            this._ufs.push(uf);
            this._brasil.ufs.lista.push(uf);
            this._brasil.ufs.porSigla[uf.sigla.toLowerCase()] = uf;
            this._brasil.ufs.porCodigo[uf.codigo] = uf;
        });
        this._brasil.ufs.lista.sort((a, b) => a.slug < b.slug ? -1 : 1);

        Object.freeze(this._municipios);
        Object.freeze(this._ufs);
        Object.freeze(this._brasil.ufs.lista);
        Object.freeze(this._brasil.ufs.porCodigo);
        Object.freeze(this._brasil.ufs.porSigla);
        Object.freeze(this._brasil.ufs);
        Object.freeze(this._brasil);
    }

}