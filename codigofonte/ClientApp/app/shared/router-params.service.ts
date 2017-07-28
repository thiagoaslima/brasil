import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { isBrowser } from 'angular2-universal'

import { Observable } from 'rxjs';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class RouterParamsService {

    public params$: Observable<any>;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute
    ) {
        this.params$ = this._router.events
            .filter(e => e instanceof NavigationEnd)
            .distinctUntilChanged()
            .map(e => this.extractParamsFromTree(this._route.snapshot, {}))
            .do((params) => {

                if (isBrowser && params && params.params && params.params.uf && params.params.municipio) {
                    localStorage.setItem('lastParams', JSON.stringify(params));
                }

            });

        this._router.events
            .filter(e => e instanceof NavigationEnd)
            .distinctUntilChanged()
            .subscribe(e => {
                if (isBrowser && (<any>window).ga) {
                    (<any>window).ga('set', 'page', e.url);
                    (<any>window).ga('send', 'pageview');
                }
            })
    }


    private getActiveChildOnOutlet(route: ActivatedRouteSnapshot, outlet = 'primary'): ActivatedRouteSnapshot | null {
        return route.children.reduce((agg, rota) => rota.outlet === outlet ? rota : agg, null);
    }

    private extractParamsFromTree(route, { params = {}, queryParams = {} }, outlet = 'primary') {
        let _params = {
            params,
            queryParams
        };

        if (!route) { return _params; }

        Object.assign(_params.params, Object.keys(route.params).reduce((agg, key) => {
            let val = decodeURIComponent(route.params[key]);
            agg[key] = val;
            return agg;
        }, {}));
        Object.assign(_params.queryParams, route.queryParams);

        return this.extractParamsFromTree(this.getActiveChildOnOutlet(route), _params, outlet);
    }

}