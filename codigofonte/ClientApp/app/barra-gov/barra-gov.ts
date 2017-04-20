import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'barra-gov',
    templateUrl: 'barra-gov.html'
})
export class BarraGov implements OnInit {

    desktop = false;

    constructor() {
        this.desktop = !this.isMobile.any();
    }

    private isMobile = {
        match: (regexp) => {
            return navigator.userAgent.match(regexp) && navigator.userAgent.match(regexp).length > 0;
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
    }

}