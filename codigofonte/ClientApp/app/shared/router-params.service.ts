import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

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
            .map(e => this.extractParamsFromTree(this._route.snapshot))
            //.share();
    }


    private getActiveChildOnOutlet(route: ActivatedRouteSnapshot, outlet = 'primary'): ActivatedRouteSnapshot | null {
        return route.children.reduce((agg, route) => route.outlet === outlet ? route : agg, null);
    }

    private extractParamsFromTree(route, params = {}, outlet = 'primary') {
        if (!route) return params;
        params = Object.assign(params, route.params);

        return this.extractParamsFromTree(this.getActiveChildOnOutlet(route), params, outlet);
    }

}