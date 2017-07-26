import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Localidade } from '../../shared3/models';
import { LocalidadeService3 } from '../../shared3/services';

@Component({
    selector: 'page-404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.css']
})
export class Page404Component {
    public isLoading = false;

    constructor(
        private _router: Router,
        private _localidadeService: LocalidadeService3
    ) { }

    handleLoading(value: boolean) {
        this.isLoading = value;
    }

    navegarPara(localidade: Localidade) {
        if (!localidade) { return; }

        let route: string[];

        switch (localidade.tipo) {
            case 'municipio':
                route = ['brasil', localidade.parent.sigla.toLowerCase(), localidade.slug, 'panorama'];
                break;

            case 'uf':
                route = ['brasil', localidade.sigla.toLowerCase(), 'panorama'];
                break;

            case 'pais':
                route = ['brasil', 'panorama'];
                break;
        }

        this._router.navigate(route, { preserveQueryParams: true });
    }

    getLocalidade(value: string) {
        const [match] = value.match(/[0-9]{1,7}/);
        return match
            ? this._localidadeService.getByCodigo(Number.parseInt(match, 10), 'proprio')[0]
            : null;
    }
}
