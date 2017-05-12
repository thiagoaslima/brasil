import { Component, OnDestroy, OnInit } from '@angular/core';

import { AppState } from '../../shared2/app-state';
import { PANORAMA } from '../configuration/panorama.configuration';

import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'panorama-shell',
    templateUrl: './panorama-shell.template.html'
})
export class PanoramaShellComponent implements OnInit, OnDestroy{


    constructor(
        private _appState: AppState
    ) {}

    ngOnInit() {
        
    }

    ngOnDestroy() {

    }
}