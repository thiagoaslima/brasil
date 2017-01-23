import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { LocalidadeService } from './shared/localidade/localidade.service';

@Injectable()
export class ValidParametersGuard implements CanActivate {
    constructor(
        private _localidadeService: LocalidadeService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot
    ) {
        if (route.params['uf']) {
            let uf = this._localidadeService.getUfBySigla(route.params['uf']);
            if (!uf) {
                return false;
            }
        }

        if (route.params['municipio']) {
            let mun = this._localidadeService.getMunicipioBySlug(route.params['uf'], route.params['municipio']);
            if (!mun) {
                return false;
            }
        }

        return true;
    }
}