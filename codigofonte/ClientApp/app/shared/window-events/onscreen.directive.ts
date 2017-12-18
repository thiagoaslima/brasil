import { Attribute, Directive, Input, Output, EventEmitter, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { WindowEventsService } from './window-events.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/operator/takeUntil';

@Directive({
    selector: '[onScreen]',
    exportAs: 'onScreenDirective'
})
export class OnSreenDirective implements OnDestroy {
    private _subscriptions: { [idx: string]: Subscription } = {};
    private _state = {
        onScreen: false
    }
    private _end$ = new Subject();

    @Output() onScreenChange = new EventEmitter();

    @Input('scroll-event')
    set scrollObservable(observable) {
        if (!observable) { return; }
        this._unsubscribe();
        this._subscriptions['scroll'] = observable.takeUntil(this._end$)
            .subscribe(evt => this.evaluate(evt.target));
    }

    public singleEmit: boolean;

    constructor(
        private element: ElementRef,
        private renderer: Renderer,
        @Attribute('multi-emit') multiEmit
    ) {
        if (!element) {
            throw new Error('Must provide a host element')
        }
        this.singleEmit = multiEmit === null;
    }

    evaluate(viewWindow) {
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

        if (isOnScreen !== this._state.onScreen) {
            this._state.onScreen = isOnScreen;
            this.onScreenChange.emit({
                element: this.element.nativeElement,
                value: isOnScreen
            });
            if (this.singleEmit) {
                this._end$.next({});
            }
        }

    }

    ngOnDestroy() {
        this._unsubscribe();
    }

    private _unsubscribe(type?: string | string[]) {
        let typeArr;

        if (type) {
            typeArr = Array.isArray(type) ? type : [type];
        } else {
            typeArr = Object.keys(this._subscriptions);
        }

        typeArr.forEach(key => {
            this._subscriptions[key].unsubscribe();
        });
    }
}