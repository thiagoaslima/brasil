import { Injectable } from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Injectable()
export class IsMobileService {

    private _android = undefined;
    private _blackBerry = undefined;
    private _iOS = undefined;
    private _opera = undefined;
    private _windows = undefined;


    private _userAgent = "";
    
    constructor() {
        if (isBrowser) {
            this._userAgent = navigator.userAgent;
        }
    }

    private match(regexp) {
        return this._userAgent.match(regexp) && this._userAgent.match(regexp).length > 0;
    }

    Android() {
        if (this._android === undefined) { this._android = this.match(/Android/i); }
        return this._android;
    }

    BlackBerry() {
        if (this._blackBerry === undefined) { this._blackBerry = this.match(/BlackBerry/i); }
        return this._blackBerry;
    }

    iOS() {
        if (this._iOS === undefined) { this._iOS = this.match(/iPhone|iPad|iPod/i); }
        return this._iOS;
    }

    Opera() {
        if (this._opera === undefined) { this._opera = this.match(/Opera Mini/i); }
        return this._opera;
    }
    
    Windows(){
        if (this._windows === undefined) { this._windows = this.match(/IEMobile/i) || this.match(/WPDesktop/i); }
        return this._windows;
    }

    any() {
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    }

}