import { DOCUMENT } from '@angular/platform-browser';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChange
} from '@angular/core';

import { isBrowser, isNode } from 'angular2-universal/browser';

import { Indicador } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { IsMobileService } from '../../shared/is-mobile.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/sample';

@Component({
    selector: 'panorama-painel',
    templateUrl: './panorama-painel.template.html',
    styleUrls: ['./panorama-painel.style.css'],
    host: {
        '(window:scroll)': 'onScroll($event)'
    }
})
export class PanoramaPainelComponent implements OnInit, OnChanges {
    @Input() dados: PanoramaConfigurationItem;
    @Input() localidade: Localidade;

    isPrerender = isNode;

    public uf: Localidade;
    public mun: Localidade;
    public indicador$: Observable<Indicador>
    public localSelecionado;
    private _selecionarIndicador$ = new BehaviorSubject<Indicador>(null);
    private _resultados = Object.create(null);
    private _rankings = Object.create(null);

    private _isOnScreen = false;
    private _isOnScreen$ = new BehaviorSubject<Boolean>(this._isOnScreen);

    public shouldAppear$: Observable<Boolean>;
    private _novosDados = true;

    constructor(
        private element: ElementRef,
        @Inject(DOCUMENT) private document,
        private _isMobileServ: IsMobileService
    ) { }

    isMobile() {
        return this._isMobileServ.any();
    }

    ngOnInit() {
        this.evaluateIsOnScreen(this.document);

        this.indicador$ = this._selecionarIndicador$
            .filter(Boolean)
            // .sample(this._isOnScreen$.filter(isOnScreen => isOnScreen.valueOf()))
            .do(indicador => this.localSelecionado = indicador.id);

        this.shouldAppear$ = this._isOnScreen$.map((isOnScreen) => {
            let novosDados = this._novosDados;
            if (isOnScreen) {
                this._novosDados = false;
            }
            let shouldAppear = isOnScreen || !novosDados

            return shouldAppear;
        })
    }

    onScroll(evt) {
        this.evaluateIsOnScreen(evt.target);
    }

    evaluateIsOnScreen(viewWindow) {
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

    ngOnChanges(changes: { [label: string]: SimpleChange }) {
        if (changes.hasOwnProperty('localidade') && Boolean(changes.localidade.currentValue)) {
            this._novosDados = true;
            this.uf = changes.localidade.currentValue.parent;
            this.mun = changes.localidade.currentValue;

        }

        if (changes.hasOwnProperty('dados') && Boolean(changes.dados.currentValue) && Boolean(changes.dados.currentValue.length)) {
            this._novosDados = true;
            this._selecionarIndicador$.next(changes.dados.currentValue[0].indicador)
        }
    }

    selectPainel(obj) {
        this._selecionarIndicador$.next(obj.indicador)
    }

    trackByIndicadorId(index, card) {
        return card.indicador ? card.indicador.id : undefined;
    }
}