import { Router, NavigationEnd } from '@angular/router';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AnalyticsService {
    private _ga = (...args: any[]) => { };

    isBrowser;

    constructor(
        private _key: string,
        private _router: Router,
        private platformId: string,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        
        if (this.isBrowser && (<any>window).ga) {
            this._ga = (<any>window).ga;
            this._startAnalytics();
        }

        if (this.isBrowser && !(<any>window).ga) {
            this._loadScript(() => {
                this._ga = (<any>window).ga;
                this._startAnalytics();
            });
        }
    }



    private _startAnalytics() {
        this._ga('create', this._key, 'auto');
    }
    listenRouterChanges() {
        this._router.events
            .filter(e => e instanceof NavigationEnd)
            .distinctUntilChanged()
            .subscribe((e: NavigationEnd) => {
                this._ga('set', 'page', e.url);
                this._ga('send', 'pageview');
            });
    }

    private _loadScript(cb) {
        window['GoogleAnalyticsObject'] = 'ga';
        window['ga'] = window['ga'] || function () {
            (window['ga'].q = window['ga'].q || []).push(arguments);
        };
        window['ga'].l = 1 * +new Date();

        let script1 = window.document.createElement('script');
        let place = window.document.getElementsByTagName('script')[0];
        script1.async = true;
        script1.src = '//www.google-analytics.com/analytics.js';
        script1.onload = cb;
        place.parentNode.insertBefore(script1, place);
    }

    log() {
        console.log('HI!');
    }

    enviarEvento({objetoInteracao, tipoInteracao, label}) {
        this._ga('send', {
            hitType: 'event',
            eventCategory: objetoInteracao,
            eventAction: tipoInteracao,
            eventLabel: label
          });
    }
}
