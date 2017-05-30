import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, style } from '@angular/core';
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
    styleUrls: ['./panorama-painel.style.css'],
    host: {
        '(window:scroll)': 'onScroll($event)'
    }
})
export class PanoramaPainelComponent implements OnInit, OnChanges {
    @Input() dados = [] as dadosPainel[]
    @Input() localidade: Localidade

    public isPrerender = isNode;
    public indexSelecionado = 0;
    public cardSelecionado = null;
    public posicaoCards = 0;
    public resultadosCartograma;

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

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (
            changes.hasOwnProperty('dados') && 
            changes.dados.currentValue && 
            changes.dados.currentValue.length > 0
        ) {
            this._novosDados = true;
            this.selectPainel(0); 
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

    public selectPainel(idx: number): void {
        let total = Object.keys(this.dados).length;

        if (idx >= 0 && idx < total) {
            this.cardSelecionado = this.dados[idx];
            this.indexSelecionado = idx;
            this.scrollCard(idx);
            this.getResultadosCartograma(this.cardSelecionado.indicadorId);
        }
    }

    scrollCard(index: number): void {
        this.posicaoCards = (index * 180) * -1;
    }

    getResultadosCartograma(indicadorId: number): void {
        this._resultadoServ
            .getResultadosCartograma(indicadorId, this.localidade.parent.codigo)
            .subscribe((resultados) => { this.resultadosCartograma = resultados;});
    }
}