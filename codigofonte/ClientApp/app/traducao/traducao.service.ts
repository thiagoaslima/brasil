import { Injectable, Optional, Inject } from '@angular/core';
import 'zone.js';

import { ORIGIN_URL, REQUEST_URL } from 'angular2-universal';

@Injectable()
export class TraducaoService {

    public _L10N: any = {
        pt: require("../../locale/brasil-pt.properties"),
        en: require("../../locale/brasil-en.properties")
    };

    private _lang;

    private getParameterByName(name, url = location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    constructor(
        @Optional() @Inject(ORIGIN_URL) originUrl: string,
        @Optional() @Inject(REQUEST_URL) requestUrl: string,
    ) {
        const prerenderURL: string = originUrl;

        console.log(originUrl);
        console.log(requestUrl);

        const queryLanguage = this.getParameterByName('lang', prerenderURL ? prerenderURL : undefined);
        const navigatorLanguage = navigator.language;
        const sessionLanguage = sessionStorage.getItem('lang');

        if (queryLanguage) {
            this._lang = queryLanguage;
        } else if(sessionLanguage) {
            this._lang = sessionLanguage;
        } else if(navigatorLanguage) {
            this._lang = navigatorLanguage;
        } else {
            this._lang = 'pt';
        }
    }

    public L10N(lang: string) {
        return this._L10N[lang.toLowerCase()] ? this._L10N[lang.toLowerCase()] : this._L10N.pt;
    }

    public get lang(): string {
        return this._lang ? this._lang.slice(0,2) : 'pt';
    }

}