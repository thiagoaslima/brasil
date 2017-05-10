import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isBrowser, isNode } from 'angular2-universal'

import { Localidade } from './shared2/localidade/localidade.model';
import { LocalidadeService2 } from './shared2/localidade/localidade.service';


@Injectable()
export class EmptyLocationGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _localidadeServ: LocalidadeService2
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let params;
        if (isNode) {
            return true;
        }

        if(isBrowser){
            params = JSON.parse(localStorage.getItem('lastParams'));
        }

        if(params) {
            this._router.navigateByUrl(`/v4/brasil/${params.params.uf}/${params.params.municipio}/panorama`);
        } else {
            let allCapitais: Localidade[] = this._localidadeServ.getAllCapitais();

            let indexCapital = Math.round(Math.random()*(allCapitais.length+1));

            let capitalSelecionada = allCapitais[indexCapital];

            let ufSlug = capitalSelecionada.parent.sigla.toLocaleLowerCase();
            let munSlug = capitalSelecionada.slug;

            this._router.navigateByUrl(`/v4/brasil/${ufSlug}/${munSlug}/panorama`);
        }
        return false;
    }
}