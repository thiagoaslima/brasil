import { Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, Output, EventEmitter, HostListener } from '@angular/core';

import { PanoramaDescriptor, PanoramaConfigurationItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Localidade } from '../../shared2/localidade/localidade.model';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html',
    styleUrls: ['./panorama-resumo.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaResumoComponent implements OnInit, OnChanges {
    @Input() dados: PanoramaDescriptor;
    @Input() localidade: Localidade;

    @Output() temaSelecionado = new EventEmitter();
    
    public isHeaderStatic;
    private _scrollTop$ = new BehaviorSubject(0);


    @HostListener('window:scroll', ['$event']) onScroll({target}) {
        if (target) {
            let scrollTop = target.body.scrollTop;
            this._scrollTop$.next(scrollTop);
        }
    }

    
    constructor() { }

    ngOnInit() {
        this.isHeaderStatic = this._scrollTop$.debounceTime(100).map(scrollTop => scrollTop > 100).distinctUntilChanged();
        
        
    }

    ngOnChanges(changes) {
        // console.log('resumo', changes)
    }

    fireTemaSelecionado(tema){
        this.temaSelecionado.emit(tema);
    }
}