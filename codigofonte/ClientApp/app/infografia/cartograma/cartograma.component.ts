import { Inject, Component, Input, OnInit, OnChanges, SimpleChange, ChangeDetectionStrategy } from '@angular/core';

import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Localidade, NiveisTerritoriais } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { Resultado } from '../../shared2/resultado/resultado.model';
import { ResultadoService2 } from '../../shared2/resultado/resultado.service';
import { MapaService } from './mapa.service';
import { RouterParamsService } from '../../shared/router-params.service';

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

// TODO: Refatorar, o detectContentChildrenChanges está consumindo cerca de 1,8 segundos
// Remover a maioria dos ASYNCs possível, eles aumentam o número de chamadas do detectContentChildrenChanges
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
    public quartis$ = new BehaviorSubject<any[]>([]);
    // public _quartis$ = this._quartis$.asObservable().share();
    private _resultados: { [idx: string]: Observable<Resultado[]> } = Object.create(null);
    public valores = null;
    public municSelected = "";

    constructor(
        private _mapaService: MapaService,
        private _localidadeService: LocalidadeService2,
        private _routerParams: RouterParamsService
    ) { }

    ngOnInit() {

        this.malha$ = this.localidade$
            .filter(Boolean)
            .flatMap((localidade) => {
                return this._mapaService.getMalhaSubdivisao(localidade.parent.codigo);
            })
            // .do(console.log.bind(console, 'geometries'));

        const resultados$ = this.indicador$
            // .distinctUntilKeyChanged('id')
            .zip(Observable.of(this.localidade))
            .filter(([indicador, localidade]) => Boolean(indicador) && Boolean(localidade))
            .flatMap(([indicador, localidade]) => {

                const municipios = this._localidadeService.getMunicipiosByRegiao(localidade.parent.codigo.toString());

                return Observable.zip(
                    ...municipios.map(localidade => indicador.getResultadoByLocal(localidade.codigo))
                );
            })
            .map(resultados => {
                return resultados
                    .map(resultado => Number.parseFloat(resultado.valorValidoMaisRecente))
                    .filter(val => !Number.isNaN(val))
                    .sort( (a, b) => a < b ? -1 : 1);
            })
            .map(valores => {
                const len = valores.length;
                const q1 = valores[Math.round(0.25 * (len + 1))];
                const q2 = len % 2 ? valores[(len + 1) / 2] : (valores[len / 2] + valores[(len / 2) + 1]) / 2
                const q3 = valores[Math.round(0.75 * (len + 1))];

                return [q1, q2, q3];
            })
            // .distinct( (a, b) => a.length === b.length && a.every( (v, idx) => v === b[idx]))
            .subscribe(arr => {this.quartis$.next(arr)});

            this.quartis$.subscribe((valores) => {
                this.valores = valores;
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

    public getCenter(geometries, codigo) {
        if (codigo) {
            let el = geometries.find(item => item.codigo.toString() == codigo.toString().substring(0,6));
            if (el.center)
                return el.center;
            else
                return [0, 0];
        } else {
            return [0, 0];
        }
    }
    public getIconHeight(bbox, pos) {
        return bbox[3]-pos[1];
    }
    public getPercLeftIconPosition(bbox, pos) {
        return Math.round(100*(pos[0]-bbox[0])/(bbox[2]-bbox[0]));
    }
    public getPercRightIconPosition(bbox, pos) {
        return 100 - this.getPercLeftIconPosition(bbox, pos);
    }
    public getPercIconPosition(bbox, pos) {
        let left = this.getPercLeftIconPosition(bbox, pos);
        let right = this.getPercRightIconPosition(bbox, pos);
        return left < right ? {left: left, right: 0, align: 'left', borderLeft: 3, borderRight: 0} : {left: 0, right: right, align: 'right', borderLeft: 0, borderRight: 3};
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