import { Injectable, Renderer2, RendererFactory2, RenderComponentType, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/share';


@Injectable()
export class WindowEventsService {
    private _renderer: Renderer2;
    private _listeners = {};

    public scroll$ = Observable.fromEventPattern(
        this._listener.bind(this, 'scroll'), 
        this._removeListeners.bind(this, 'scroll')
    ).share();

     public resize$ = Observable.fromEventPattern(
        this._listener.bind(this, 'resize'), 
        this._removeListeners.bind(this, 'resize')
    ).share();

    private _listener(eventName: string, handler) {
        this._listeners[eventName] = this._renderer.listen('window', eventName, handler);
    }
    private _removeListeners(eventName: string) {
        return this._listeners[eventName]();
    }

    constructor(
        private rootRenderer: RendererFactory2
    ) {
        let type = new RenderComponentType('ScrollServiceRenderer', '', 0, ViewEncapsulation.None, [], {});
        this._renderer = rootRenderer.createRenderer(null, null);
    }
} 
