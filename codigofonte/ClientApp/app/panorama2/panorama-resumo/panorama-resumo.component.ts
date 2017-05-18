import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChange
} from '@angular/core';

import { TEMAS } from '../../panorama2/configuration';
import { converterObjArrayEmHash } from '../../utils2';
import { Resultado } from '../../shared3/models'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html',
    styleUrls: ['./panorama-resumo.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaResumoComponent implements OnChanges {

    static readonly getTema = (function (value) {
        const temas = converterObjArrayEmHash(Object.keys(value).map(k => value[k]), 'label');

        return function (label: string) {
            return temas[label] || null;
        }
    })(TEMAS);

    @Input() configuracao = [];
    @Input() localidade = null;
    @Input() resultados = [];

    public cabecalho = [];
    public temas = [];
    public isHeaderStatic: Observable<boolean>;

    private _valores = {};
    private _scrollTop$ = new BehaviorSubject(0);

    @Output() temaSelecionado = new EventEmitter();
    temaAtual = '#po';

    @HostListener('window:scroll', ['$event']) onScroll({ target }) {
        if (target) {
            let scrollTop = target.body.scrollTop;
            this._scrollTop$.next(scrollTop);
        }
    }

    constructor() { }

    ngOnInit() {
        this.isHeaderStatic = this._scrollTop$.debounceTime(100).map(scrollTop => scrollTop > 100).distinctUntilChanged();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.hasOwnProperty('configuracao') && changes.configuracao.currentValue.length > 0) {
            let temas = changes.configuracao.currentValue.slice(0);
            let cabecalho = [];
            let i = 0;
            while (temas[i].tema === "") {
                cabecalho.push(temas.shift());
            }

            this.cabecalho = cabecalho;
            this.temas = temas;
        }

        if (changes.hasOwnProperty('resultados') && changes.resultados.currentValue.length > 0) {
            this._valores = converterObjArrayEmHash(changes.resultados.currentValue, 'indicadorId', false);
        }
    }

    ngOnDestroy() {
        this._scrollTop$.complete();
        this._scrollTop$ = null;
    }

    getTitulo(indicadorId: number): string {
        return this._valores[indicadorId] ? this._valores[indicadorId].indicador.nome : '';
    }

    getUnidade(indicadorId: number): string {
        return this._valores[indicadorId] ? this._valores[indicadorId].indicador.unidade.toString() : '';
    }

    getValorMaisRecente(indicadorId: number): string {
        return this._valores[indicadorId] ? (<Resultado>this._valores[indicadorId]).valorValidoMaisRecente : '';
    }

    getPeriodoMaisRecente(indicadorId: number): string {
        return this._valores[indicadorId] ? (<Resultado>this._valores[indicadorId]).periodoValidoMaisRecente : '';
    }

    getIconSrc(label: string): string {
        return './img/ico/' + PanoramaResumoComponent.getTema(label).icon;
    }

    fireTemaSelecionado(tema) {
        if (this.temaAtual == tema) {
            this.temaSelecionado.emit(tema + '-alt');
            this.temaAtual = '';
        }
        else {
            this.temaSelecionado.emit(tema);
            this.temaAtual = tema;
        }
    }

}