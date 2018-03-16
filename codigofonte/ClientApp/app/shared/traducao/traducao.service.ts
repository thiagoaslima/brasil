import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import 'zone.js';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class TraducaoService {
    
    isBrowser: boolean;

    public _L10N: any = {
        pt: require("../../../locale/brasil-pt.properties"),
        en: require("../../../locale/brasil-en.properties")
    };

    private _lang;

    private getParameterByName(name, url = location && location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    constructor(
        @Inject(PLATFORM_ID) platformId: string
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        const prerenderURL: string = Zone.current.get('originUrl');

        //const queryLanguage = this.getParameterByName('lang', prerenderURL ? prerenderURL : undefined);
        const queryLanguage = undefined;

        this.lang = 'pt';

        // if (this.isBrowser) {

        //     const navigatorLanguage = navigator.language;
        //     const sessionLanguage = sessionStorage.getItem('lang');

        //     if (queryLanguage) {
        //         this.lang = queryLanguage;
        //     } else if(sessionLanguage) {
        //         this.lang = sessionLanguage;
        //     } else if(navigatorLanguage) {
        //         this.lang = navigatorLanguage;
        //     } else {
        //         this.lang = 'pt';
        //     }

        // } else {
        //     this.lang = 'pt';
        // }

    }

    public L10N(lang: string, value:any) {
        let props = this._L10N[lang.toLowerCase()] ? this._L10N[lang.toLowerCase()] : this._L10N.pt;

        if(props[value] == undefined || props[value] == "") {
            return this._L10N.pt[value];
        } else {
            return props[value];
        }

    }

    public get lang(): string {
        return this._lang ? this._lang.slice(0,2) : 'pt';
    }

    public set lang(lang: string) {
        this._lang = lang;

        if (this.isBrowser) {
            sessionStorage.setItem('lang', this._lang);
        }
    }

}