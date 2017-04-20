import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges, 
    HostListener
} from '@angular/core';


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

    @Output() temaSelecionado = new EventEmitter();
    temaAtual;
    
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

    ngOnChanges(changes: SimpleChanges) {}

    fireTemaSelecionado(tema){
        if(this.temaAtual == tema){
            this.temaSelecionado.emit(tema+'-alt');
            this.temaAtual = '';
        }
        else{
            this.temaSelecionado.emit(tema);
            this.temaAtual = tema;
        }
    }
}