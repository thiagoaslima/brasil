import { LocalidadeService2 } from './shared2/localidade/localidade.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class V3RouterGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _localidadeServ: LocalidadeService2
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let cidadeSelecionada = this._localidadeServ.getMunicipioByCodigo(route.params['codmun']);

        let ufSlug = cidadeSelecionada.parent.sigla.toLocaleLowerCase();
        let munSlug = cidadeSelecionada.slug;

        this._router.navigateByUrl(`/v4/brasil/${ufSlug}/${munSlug}/panorama`);
        return true;
    }
}
