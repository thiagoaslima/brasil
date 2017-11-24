import { Component, OnInit } from '@angular/core';

import { isBrowser } from 'angular2-universal';

import { RouterParamsService } from '../router-params.service';

@Component({
    selector: 'qrcode',
    templateUrl: './qrcode.component.html',
    styleUrls: ['./qrcode.component.css']
})

export class QRCodeComponent implements OnInit {
    static readonly servicoMin = 'https://cod.ibge.gov.br/min?u=';
    static readonly servicoQR = 'https://cod.ibge.gov.br/qr?d=';

    public isBrowser = isBrowser;

    qrURL = '';

    constructor(
        private _routerParamsServ: RouterParamsService
    ) { }

    ngOnInit() {
        this._routerParamsServ.params$.subscribe(params => {
            if (this.isBrowser) {
                this.qrURL = `${QRCodeComponent.servicoQR}${encodeURIComponent(window.location.href)}`;
            }
        });
    }
}