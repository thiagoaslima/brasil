import { Component, ElementRef, Input } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal';

import { IsMobileService } from "../../shared/is-mobile.service";
import { dadosPainel } from '../configuration/panorama.values';
import { Localidade } from '../../shared3/models';
import { ResultadoService3 } from "../../shared3/services";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'panorama-painel',
    templateUrl: './panorama-painel.template.html',
    host: {
        '(window:scroll)': 'onScroll($event)'
    }
})
export class PanoramaPainelComponent {
    @Input() dados = [] as dadosPainel[]
    @Input() localidade: Localidade

    public isPrerender = isNode;

    private _isOnScreen = false;
    private _isOnScreen$ = new BehaviorSubject<Boolean>(this._isOnScreen);
    public shouldAppear$: Observable<Boolean>;
    private _novosDados = true;

    constructor(
        private element: ElementRef,
        private _isMobileServ: IsMobileService,
        private _resultadoServ: ResultadoService3
    ) { }

    isMobile() {
        return this._isMobileServ.any();
    }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if (isBrowser) {
            this.evaluateIsOnScreen(document);
        }

        if (isBrowser) {
            this.shouldAppear$ = this._isOnScreen$.map((isOnScreen) => {
                let novosDados = this._novosDados;
                if (isOnScreen) {
                    this._novosDados = false;
                }
                let shouldAppear = isOnScreen || !novosDados
                return shouldAppear;
            })
        }
    }

    public onScroll(evt) {
        if (isBrowser) {
            this.evaluateIsOnScreen(evt.target);
        }
    }

    public evaluateIsOnScreen(viewWindow) {
        if (
            !this.element.nativeElement ||
            typeof this.element.nativeElement.getBoundingClientRect !== "function"
        ) {
            return false;
        }

        let element = this.element.nativeElement.getBoundingClientRect();

        if (viewWindow && viewWindow.nodeType === 9) {
            // viewWindow === document
            viewWindow = viewWindow['body'];
        }

        if (
            !viewWindow ||
            viewWindow.nodeType !== 1 ||
            !element
        ) { return false; }

        let isOnScreen = (!!element
            && element.bottom >= 0
            && element.right >= 0
            && element.top <= viewWindow.clientHeight
            && element.left <= viewWindow.clientWidth
        );

        if (isOnScreen !== this._isOnScreen) {
            this._isOnScreen = isOnScreen;
            this._isOnScreen$.next(this._isOnScreen);
        }
    }
}