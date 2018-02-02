import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, RouterState, RouterStateSnapshot } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';


export interface RouterParams {
    params: { [key: string]: string };
    queryParams: { [key: string]: string };
    url: string;
}

@Injectable()
export class RouterParamsService {

    public params$: BehaviorSubject<RouterParams>;
    private isBrowser: boolean;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        @Inject(PLATFORM_ID) platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);

        this.params$ = new BehaviorSubject({ params: {}, queryParams: {}, url: '' });

        this._router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .distinctUntilChanged()
            .map((e: any) => {
                let params = this.extractParamsFromTree(this._router.routerState.snapshot.root, {});
                if (e.url != null) {

                    params.params.url = e.url
                }
                return params;
            }).subscribe(params => this.params$.next(params));


        // this._router.events
        //     .filter(e => e instanceof NavigationEnd)
        //     .distinctUntilChanged()
        //     .subscribe(e => {
        //         if (isBrowser && (<any>window).ga) {
        //             (<any>window).ga('set', 'page', e.url);
        //             (<any>window).ga('send', 'pageview');
        //         }
        //     })
    }


    private getActiveChildOnOutlet(route: ActivatedRouteSnapshot, outlet = 'primary'): ActivatedRouteSnapshot | null {
        // return route.children.reduce((agg, rota) => rota.outlet === outlet ? rota : agg, null);
        return route.children.find(rota => {
            return rota.outlet === outlet;
        }) || null;
    }

    private extractParamsFromTree(route: ActivatedRouteSnapshot | null, { params = {}, queryParams = {}, url = '' }, outlet = 'primary'): RouterParams {
        let _params = {
            params,
            queryParams,
            url
        };

        if (!route) { return _params; }

        Object.assign(_params.params, Object.keys(route.params).reduce((agg, key) => {
            let val = decodeURIComponent(route.params[key]);
            agg[key] = val;
            return agg;
        }, <any>{}));

        Object.assign(_params.queryParams, route.queryParams);

        return this.extractParamsFromTree(this.getActiveChildOnOutlet(route), _params, outlet);
    }

}