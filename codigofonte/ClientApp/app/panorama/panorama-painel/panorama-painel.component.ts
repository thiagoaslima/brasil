import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';

import { isBrowser, isNode } from 'angular2-universal';

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

declare var document: any;

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
    public indexSelecionado = 0;
    public tituloCartograma = '';
    private _selecionarIndicador$ = new BehaviorSubject<Indicador>(null);
    private _resultados = Object.create(null);
    private _rankings = Object.create(null);

    private _isOnScreen = false;
    private _isOnScreen$ = new BehaviorSubject<Boolean>(this._isOnScreen);

    public shouldAppear$: Observable<Boolean>;
    private _novosDados = true;

    // card
    public posicao = 0;
    public card = 0;
    public navProximo = true;
    public navAnterior = false;
    
    constructor(
        private element: ElementRef,
        private _isMobileServ: IsMobileService
    ) { }

    isMobile() {
        return this._isMobileServ.any();
    }

    ngOnInit() {

        if(isBrowser){
            this.evaluateIsOnScreen(document);
        }

        this.indicador$ = this._selecionarIndicador$
            .filter(Boolean)
            // .sample(this._isOnScreen$.filter(isOnScreen => isOnScreen.valueOf()))
            .do(indicador => this.localSelecionado = indicador.id);

        if(isBrowser){

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

    onScroll(evt) {

        if(isBrowser){
            this.evaluateIsOnScreen(evt.target);
        }
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('localidade') && Boolean(changes.localidade.currentValue)) {
            this._novosDados = true;
            this.uf = changes.localidade.currentValue.parent;
            this.mun = changes.localidade.currentValue;

        }

        if (changes.hasOwnProperty('dados') && Boolean(changes.dados.currentValue) && Boolean(changes.dados.currentValue.length)) {
            this._novosDados = true;
            this.selectPainel(0);
            // this._selecionarIndicador$.next(changes.dados.currentValue[0].indicador)
        }
    }

    selectPainel(idx) {
        let total = Object.keys(this.dados).length;

        if(idx>=0 && idx < total){
            this._selecionarIndicador$.next(this.dados[idx].indicador);
            this.tituloCartograma = this.dados[idx].titulo || this.dados[idx].indicador.nome;
            this.scrollCard(idx);
            this.indexSelecionado = idx;
        }

        this.navAnterior = (idx<=0) ? false : true;   
        this.navProximo = (idx>=total-1) ? false : true;
    }

    trackByIndicadorId(index, card) {
        return card.indicador ? card.indicador.id : undefined;
    }


    scrollCard(index){
        this.posicao =  (index*180) * -1;
    }

}