import { Inject, Component, Input, OnInit, OnChanges, SimpleChange, ChangeDetectionStrategy } from '@angular/core';

import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { Resultado } from '../../shared2/resultado/resultado.model';
import { ResultadoService2 } from '../../shared2/resultado/resultado.service';
import { MapaService } from './mapa.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';

/*
 * Implementado apenas o mapa de uf dividido por municípios
 * TODO: Generalizar para qualquer mapa com diferentes subdivisões
 */

@Component({
    selector: 'cartograma',
    templateUrl: 'cartograma.template.html',
    styleUrls: ['mapa.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartogramaComponent implements OnInit, OnChanges {
    @Input() localidade: Localidade;
    @Input() indicador: Indicador;
    @Input() periodo;

    public malha$;
    public hashResultado$;
    public localidade$ = new BehaviorSubject<Localidade>(null);
    public indicador$ = new BehaviorSubject<Indicador>(null);
    public quartis$: Observable<number[]>;
    private _resultados: { [idx: string]: Observable<Resultado[]> } = Object.create(null);

    constructor(
        private _mapaService: MapaService,
        private _resultadoService: ResultadoService2
    ) { }

    ngOnInit() {
        this.malha$ = this.localidade$
            .filter(Boolean)
            .flatMap(localidade => {
                return this._mapaService.getMalhaSubdivisao(localidade.codigo);
            })
            .do(console.log.bind(console, 'geometries'));

        const codigoRegiao$ = this.localidade$
            .filter(Boolean)
            .map(localidade => `${localidade.codigo}xxxx`);


        const resultados$ = this.indicador$
            .combineLatest(codigoRegiao$)
            .filter(([indicador, codigo]) => Boolean(indicador) && Boolean(codigo))
            .flatMap(([indicador, codigo]) => {
                const key = `${indicador.id}-${codigo}`
                if (!this._resultados[key]) {
                    this._resultados[key] = this._resultadoService.getResultados(indicador.pesquisaId, indicador.posicao, codigo, EscopoIndicadores.proprio)
                        .do(resultados => this._resultados[key] = Observable.of(resultados));
                }
                return this._resultados[key];
            });
        
        this.hashResultado$ = resultados$
            .map(resultados => resultados.reduce( (acc, resultado) => {
                acc[resultado.localidadeCodigo] = resultado;
                return acc;
            }, Object.create(null)));

        this.quartis$ = resultados$
            .map(resultados => {
                return resultados
                    .map(resultado => Number.parseFloat(resultado.valorValidoMaisRecente))
                    .filter(val => !Number.isNaN(val))
                    .sort();
            })
            .map(valores => {
                const len = valores.length;
                const q1 = valores[Math.round(0.25 * (len + 1))];
                const q2 = len % 2 ? valores[(len + 1) / 2] : (valores[len / 2] + valores[(len / 2) + 1]) / 2
                const q3 = valores[Math.round(0.75 * (len + 1))];

                return [q1, q2, q3];
            });

    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes.hasOwnProperty('localidade')
            && Boolean(changes.localidade.currentValue)
            && (!changes.localidade.previousValue || changes.localidade.currentValue.codigo !== changes.localidade.previousValue.codigo)) {
            this.localidade$.next(changes.localidade.currentValue);
        }

        if (changes.hasOwnProperty('indicador')
            && Boolean(changes.indicador.currentValue)
            && (!changes.indicador.previousValue || changes.indicador.currentValue.id !== changes.indicador.previousValue.id)) {
            this.indicador$.next(changes.indicador.currentValue);
        }
    }

    getValor(codigo) {
        return this.hashResultado$.map(hash => hash[codigo].valorValidoMaisRecente);
    }
}

@Component({
    selector: '[regiao-mapa]',
    template: `<svg:g #item 
                    [attr.class]="faixa$ | async" 
                    [attr.codigo]="codigo" 
                    [attr.nome]="nome" 
                    [attr.link]="link" 
                    [attr.ano]="ano" 
                    [attr.valor]="valor" 
                    [attr.faixa]="faixa$ | async"
                    (click)="selecionaRegiao()">
                    
                    <polygon *ngFor="let poly of polygons" [attr.points]="poly" />
                </svg:g>`,
    styleUrls: ['mapa.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalCartogramaComponent implements OnInit, OnChanges {
    @Input() codigo;
    @Input() nome;
    @Input() link;
    @Input() valor;
    @Input() quartis;
    @Input() polygons;

    public faixa$: Observable<string>;
    public valor$ = new BehaviorSubject<string>('');
    private _quartis$ = new BehaviorSubject<number[]>([]);

    ngOnInit() {
        this.faixa$ = this.valor$
            .combineLatest(this._quartis$)
            .filter(([valor, quartis]) => valor !== undefined && Boolean(quartis.length))
            .map(([valor, quartis]) => {
                let faixa;
                const valorNumerico = Number.parseFloat(valor);
                if (Number.isNaN(valorNumerico)) {
                    return 'semValor';
                }

                if (valorNumerico < quartis[0]) {
                    faixa = 'faixa1'
                }
                else if (valorNumerico < quartis[1]) {
                    faixa = 'faixa2'
                }
                else if (valorNumerico < quartis[2]) {
                    faixa = 'faixa3'
                }
                else {
                    faixa = 'faixa4'
                }

                return faixa;
            })
    }

    ngOnChanges(changes) {
        if (changes.valor && changes.valor.currentValue) {
            this.valor$.next(changes.valor.currentValue)
        }

        if (changes.quartis && changes.quartis.currentValue) {
            this._quartis$.next(changes.quartis.currentValue)
        }
    }

    selecionaRegiao() {
        // this.onRegiao.emit({codigo: this.codigo, nome: this.nome, link: this.link, valor: this.valor, regiao: this}); //emite o evento do clique na região
    }
}