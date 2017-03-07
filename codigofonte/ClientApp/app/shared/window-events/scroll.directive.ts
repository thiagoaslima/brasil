import { Attribute, Directive, HostListener, Input, Output, EventEmitter, ElementRef, Renderer, OnInit, OnDestroy } from '@angular/core';
import { WindowEventsService } from './window-events.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';

export class ScrollEvent {
    toTop = false;
    toLeft = false;
    toRight = false;
    toBottom = false;

    top = 0;
    left = 0;

    target?= null;
    originalEvent: Event = null;
}

@Directive({
    selector: '[scroll]',
    exportAs: 'scrollDirective',
    providers: [
        ScrollEvent
    ]
})
export class ScrollDirective {
    public host$: Observable<ScrollEvent>;
    public window$: Observable<ScrollEvent>;
    public scrollEl$: Observable<ScrollEvent>;

    private _defaultTimer = 200;
    private _timer: number;
    private _el;
    private _listeners = {};

    @Input()
    set scroll(value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(value, { events: this });
        }
    }

    @Input()
    set timer(value: number) {
        this._timer = value;
    }
    get timer() {
        return this._timer || this._defaultTimer;
    }

    @Input()
    set element(el) {
        if (!el) { return; }

        this._el = el;

        // Avoid memory leak!!!
        this.reset();

        this.scrollEl$ = Observable
            .fromEventPattern(this._createElListener.bind(this), this._removeListener.bind(this, 'el'))
            .throttleTime(this.timer)
            .scan<ScrollEvent>((acc: ScrollEvent, evt: Event) => this.setScrollEvent(acc, evt.target))
            .share()
            .startWith(this.setScrollEvent(new ScrollEvent, el));
    }
    get element() {
        return this._el;
    }

    constructor(
        private host: ElementRef,
        private renderer: Renderer,
        private windowEvents: WindowEventsService
    ) {
        this.window$ = this.windowEvents
            .scroll$.throttleTime(this.timer)
            .scan<ScrollEvent>((acc: ScrollEvent, evt: Event) => {
                return this.setScrollEvent(acc, evt.target)
            })
            .share()
            .startWith(new ScrollEvent());

        this.host$ = Observable
            .fromEventPattern(this._createHostListener.bind(this), this._removeListener.bind(this, 'host'))
            .throttleTime(this.timer)
            .scan<ScrollEvent>((acc: ScrollEvent, evt: Event) => this.setScrollEvent(acc, evt.target))
            .share()
            .startWith(this.setScrollEvent(new ScrollEvent, this.host.nativeElement));
    }

    private _createElListener(handler) {
        this._listeners['el'] = this.renderer.listen(this.element, 'scroll', handler);
    }
    private _createHostListener(handler) {
        this._listeners['host'] = this.renderer.listen(this.host.nativeElement, 'scroll', handler);
    }
    private _removeListener(key) {
        return this._listeners[key];
    }
    private reset(key?) {
        // Avoid memory leak!!!
        if (key) {
            (!!this._listeners[key]) && this._listeners[key]();
            return;
        }

        Object.keys(this._listeners).forEach(key => this._listeners[key]());
    }
    private setScrollEvent(acc: ScrollEvent, evt) {
        let target;
        let top = 0, left = 0;

        if (evt['target']) {
            target = evt.target;
        } else {
            target = evt;
            evt = null;
        }

        if (target && (target['scrollTop'] || target['scrollY'] || target['body'])) {
            // target instanceOf Element || target === document || target === window
            top = target['scrollTop'] !== undefined ? target['scrollTop'] : target['body'] ? target['body'].scrollTop : target['scrollY'];
            left = target['scrollLeft'] !== undefined ? target['scrollLeft'] : target['body'] ? target['body'].scrollLeft : target['scrollX'];
        }

        return {
            toTop: (top < acc.top),
            toBottom: (top > acc.top),
            toLeft: (left < acc.left),
            toRight: (left > acc.left),

            top, left,

            target,
            originalEvent: evt
        }
    }

    ngOnDestroy() {
        this.reset();
    }
}