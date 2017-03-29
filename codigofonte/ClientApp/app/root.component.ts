import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { LocalidadeService } from './shared/localidade/localidade.service';
import { LocalidadeService2 } from './shared2/localidade/localidade.service';
import { PesquisaService2 } from './shared2/pesquisa/pesquisa.service';
import { IndicadorService2 } from './shared2/indicador/indicador.service';
import { ResultadoService2 } from './shared2/resultado/resultado.service';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'root',
    templateUrl: './root.template.html'
})
export class RootComponent implements OnInit, OnDestroy {
    @ViewChild('abreMenuGlobal') button: ElementRef;

    public locais;
    public localidadeSelecionada;
    public isHeaderStatic;
    public menuGlobalAberto = false;
    public menuAberto = false;

    private _localSelecionada$$: Subscription;
    private _scrollTop$ = new BehaviorSubject(0);


    @HostListener('window:scroll', ['$event']) onScroll({target}) {
        if (target) {
            let scrollTop = target.body.scrollTop;
            this._scrollTop$.next(scrollTop);
        }
    }

    @HostListener('click', ['$event']) onHostClick({target}) {
        if (this.menuGlobalAberto && target && !this.button.nativeElement.contains(target)) {
            this.menuGlobalAberto = false;
        }

        if (this.button.nativeElement.contains(target)) {
            this.menuGlobalAberto = !this.menuGlobalAberto;
        }
    }

    constructor(
        private _route: ActivatedRoute,
        private _localidadeService: LocalidadeService
    ) {
        this.locais = this._localidadeService.tree$;
    }

    ngOnInit() {
        this._localSelecionada$$ = this._localidadeService.selecionada$.subscribe(localidade => this.localidadeSelecionada = localidade);
        this.isHeaderStatic = this._scrollTop$.debounceTime(100).map(scrollTop => scrollTop > 100).distinctUntilChanged();

        //verifica se o componente de detalhes está aberto (mobile)
        this._route.queryParams.subscribe(params => {
            if(params['detalhes'] == 'true'){
                this.menuAberto = true;
            } else {
                this.menuAberto = false;
            }
        });
    }

    ngOnDestroy() {
        this._localSelecionada$$.unsubscribe();
    }

    getLink(str) {
        return this.localidadeSelecionada
            ? this.localidadeSelecionada.link + '/' + str
            : '/brasil/' + str;
    }

    handleSeletorAberto(seletorAberto){
        this.menuAberto = seletorAberto;
    }

}