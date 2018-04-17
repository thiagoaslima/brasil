import { PLATFORM_ID, Inject, Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';

import 'rxjs/add/operator/map';

import { ModalErrorService } from '../';


@Component({
    selector: 'barra-gov',
    templateUrl: 'barra-gov.component.html',
    styles: [`
    body {
        background: #FCCA00;
        margin: 0;
        padding: 0;
        margin-top: -2px;
        margin-bottom: -2px;
        overflow: hidden;
    }`]
})
export class BarraGov implements OnInit {

    desktop = false;
    public isBrowser;

    constructor(
        private _http: Http,
        private modalErrorService: ModalErrorService,
        @Inject(PLATFORM_ID) platformId: string
    ) {
        this.desktop = !this.isMobile.any();
        this.isBrowser = isPlatformBrowser(platformId);
    }

    private isMobile = {
        match: (regexp) => {
            if (this.isBrowser) {
                return navigator.userAgent.match(regexp) && navigator.userAgent.match(regexp).length > 0;
            }
        },
        Android: () => {
            return this.isMobile.match(/Android/i);
        },
        BlackBerry: () => {
            return this.isMobile.match(/BlackBerry/i);
        },
        iOS: () => {
            return this.isMobile.match(/iPhone|iPad|iPod/i);
        },
        Opera: () => {
            return this.isMobile.match(/Opera Mini/i);
        },
        Windows: () => {
            return this.isMobile.match(/IEMobile/i) || this.isMobile.match(/WPDesktop/i);
        },
        any: () => {
            return (this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows());
        }
    };

    ngOnInit() {
        this._loadBarraGovScript();
    }

    private _loadBarraGovScript() {
        if (this.isBrowser && window) {
            let script1 = window.document.createElement('script');
            let place = window.document.getElementsByTagName('script')[0];
            this._http.get('//barra.brasil.gov.br/barra.js')
                .map(res => res.text())
                .subscribe(text => {
                    if (text.indexOf('font-face') >= 0) {
                        text = text.replace(/@font-face{[A-Za-z-:"',\s;0-9()\/\.]*}/g, '');
                    }
                    script1.textContent = text;
                    place.parentNode.insertBefore(script1, place);

                    let script2 = window.document.createElement('script');
                    script2.textContent = `
                    setTimeout(function() {
                        var links = document.getElementsByTagName('a');
                        for (i = 0; i < links.length; i++) {
                            links[i].setAttribute('target', '_blank');
                        }
                    }, 1000);`;
                    place.parentNode.insertBefore(script2, place);

                },
                error => {
                    console.error(error);
                    this.modalErrorService.showError();
                });
        }

    }
}