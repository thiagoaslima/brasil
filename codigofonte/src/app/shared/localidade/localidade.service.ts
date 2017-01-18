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
    private brasil: IBrasil;
    private municipios = <Municipio[]>[];
    private ufs = <UF[]>[];

    public tree$: Observable<any>;
    public selecionada$: Observable<IBrasil | UF | Municipio>;

    constructor(
        private _params: RouterParamsService
    ) {
        this._buildLocalidadesTree();

        this.tree$ = this._params.params$
            .map((params: { [idx: string]: string }) => ({ uf: params['uf'], municipio: params['municipio'] }))
            .map(slugs => {
                let uf = this.getUfBySlug(slugs.uf);
                let mun = this.getMunicipioBySlug(slugs.uf, slugs.municipio);

                return [this.brasil, uf, mun].filter(value => !!value);
            });

        this.selecionada$ = this.tree$.map(tree => tree[tree.length - 1]);
    }

    public getUfByCodigo(ufCodigo): UF {
        if (!ufCodigo) return;
        return this._getUf('codigo', ufCodigo);
    }

    public getUfBySlug(ufSlug): UF {
        if (!ufSlug) return;
        return this._getUf('slug', ufSlug);
    }

    public getMunicipioBySlug(ufSlug, munSlug): Municipio {
        if (!ufSlug || !munSlug) return;
        return this._getMun('slug', ufSlug, munSlug);
    }

    private _getUf(where, ufKey) {
        let prop = where === 'slug' ? 'porSlug' : 'porCodigo';
        return this.brasil.ufs[prop][ufKey];
    }

    private _getMun(where, ufKey, munKey) {
        let prop = where === 'slug' ? 'porSlug' : 'porCodigo';
        return this.brasil.ufs[prop][ufKey].municipios[prop][ufKey];
    }

    private _buildLocalidadesTree() {
        let hashUfs = ufs.reduce((agg, uf) => {
            uf['municipios'] = [];
            agg[uf.codigo] = uf;
            return agg;
        }, {});

        // build all municipios and registers on uf
        municipios.forEach(mun => {
            mun = new Municipio(mun);
            hashUfs[mun.codigoUf].municipios.push(mun);
            this.municipios.push(mun);
        });

        // build all ufs
        Object.keys(hashUfs).forEach(codigoUf => {
            let uf = new UF(hashUfs[codigoUf]);
            this.ufs.push(uf);
        });

        this.brasil = brasil;
        this.brasil.ufs = this.ufs;

        Object.freeze(this.municipios);
        Object.freeze(this.ufs);
        Object.freeze(this.brasil);
    }

    log() {
        console.log(this.brasil);
    }
}