import { Inject, Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';

import { Indicador } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { MapaService } from './mapa.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';

/*
 * Implementado apenas o mapa de uf dividido por municípios
 * TODO: Generalizar para qualquer mapa com diferentes subdivisões
 */

@Component({
    selector: 'cartograma',
    templateUrl: 'cartograma.template.html',
    styleUrls: ['mapa.style.css']
})
export class CartogramaComponent implements OnInit, OnChanges {
    @Input() localidade: Localidade;
    @Input() indicador: Indicador;
    @Input() periodo;
    
    public malha$;
    private _localidade$ = new BehaviorSubject<Localidade>(null);
    private _indicador$ = new BehaviorSubject<Indicador>(null);

    constructor(
        private _mapaService: MapaService
    ){}

    ngOnInit() {
       this.malha$ = this._localidade$
            .filter(Boolean)
            .distinctUntilKeyChanged('codigo')
            .flatMap(localidade => {
                return this._mapaService.getMalhaSubdivisao(localidade.codigo);
            }); 
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (changes.hasOwnProperty('codigoLocalidade') && Boolean(changes.localidade.currentValue)) {
            this._localidade$.next(changes.localidade.currentValue);
        }

        if (changes.hasOwnProperty('indicador') && Boolean(changes.indicador.currentValue)) {
            this._indicador$.next(changes.indicador.currentValue);
        }
    }
}

@Component({
    selector: '[regiao-mapa]',
    template: `<svg:g #item 
                    [attr.class]="classeCss" 
                    [attr.codigo]="codigo" 
                    [attr.nome]="nome" 
                    [attr.link]="link" 
                    [attr.ano]="ano" 
                    [attr.valor]="valor" 
                    [attr.faixa]="faixa"
                    (click)="selecionaRegiao()">
                    
                    <polygon *ngFor="let poly of polygons" [attr.points]="poly" />
                </svg:g>`,
    styleUrls: ['mapa.style.css']
})
export class LocalCartogramaComponent {
    @Input('classeCss') _classeCss;
    @Input() codigo;
    @Input() nome;
    @Input() link;
    @Input('valor') _valor = '';
    @Input() faixa;
    @Input() polygons;
    @Input() faixas;

    get valor() {
        return this.faixas && this.faixas[this.codigo] ? this.faixas[this.codigo]['valor'] : ''
    }
    get classeCss() {
        return this.faixas && this.faixas[this.codigo] ? this.faixas[this.codigo]['faixa'] : ''
    }

    ngOnChanges(changes) {
        if (this.codigo) {
            //console.log(this.codigo, changes, this);
        }
    }

    selecionaRegiao(){
        // this.onRegiao.emit({codigo: this.codigo, nome: this.nome, link: this.link, valor: this.valor, regiao: this}); //emite o evento do clique na região
    }
}