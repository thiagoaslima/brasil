import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeoLocationService {
    window = null;
    navigator = null;

    constructor(
        @Inject(DOCUMENT) private document
    ) { 
        this.window = document['window'];
        if (window) {
            this.navigator = window['navigator'];
        }
    }

    getPosition() {
        
    }
}