import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { RouterParamsService } from '../router-params.service';

@Component({
    selector: 'qrcode',
    templateUrl: './qrcode.component.html',
    styleUrls: ['./qrcode.component.css']
})

export class QRCodeComponent implements OnInit {
    static readonly servicoMin = 'https://cod.ibge.gov.br/min?u=';
    static readonly servicoQR = 'https://cod.ibge.gov.br/qr?d=';

    public isBrowser;

    qrURL = '';

    constructor(
        private _routerParamsServ: RouterParamsService,
        @Inject(PLATFORM_ID) platformId: string
    ) {
        this.isBrowser = isPlatformBrowser(platformId)
    }

    ngOnInit() {
        this._routerParamsServ.params$.subscribe(params => {
            if (this.isBrowser) {
                this.qrURL = `${QRCodeComponent.servicoQR}${encodeURIComponent(window.location.href)}`;
            }
        });
    }
}