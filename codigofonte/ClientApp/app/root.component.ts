import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { isBrowser } from 'angular2-universal'

import { AppState } from './shared2/app-state';
import { RouterParamsService } from './shared/router-params.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import {TituloBrowserComponent} from './core/titulo-browser/titulo-browser.component'

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'root',
    templateUrl: './root.template.html'
})
export class RootComponent implements OnInit, OnDestroy {
    @ViewChild('abreMenuGlobal') button: ElementRef;

    public locais = [];
    public localidadeSelecionada = null;
    public isHeaderStatic;
    public menuGlobalAberto = false;
    public menuAberto = false;
    public abrirMenuPesquisa = false;
    public itemSelecionado;

    public isBrowser = isBrowser;

    private _localidade$$: Subscription;
    private _scrollTop$ = new BehaviorSubject(0);


    @HostListener('window:scroll', ['$event'])
    onScroll({ target }) {
        if (target) {
            let scrollTop = target.body.scrollTop;
            this._scrollTop$.next(scrollTop);
        }
    }

    @HostListener('click', ['$event'])
    onHostClick({ target }) {
        if (this.menuGlobalAberto && target && !this.button.nativeElement.contains(target)) {
            this.menuGlobalAberto = false;
        }

        if (this.button.nativeElement.contains(target)) {
            this.menuGlobalAberto = !this.menuGlobalAberto;
        }
    }

    constructor(
        private _route: ActivatedRoute,
        private _appState: AppState,
        private _routerParams: RouterParamsService
    ) { }

    ngOnInit() {
        this._localidade$$ = this._appState.observable$
            .subscribe(({ localidade }) => {
                this.localidadeSelecionada = localidade;
                const locais = [localidade];
                if (localidade) { locais.push(localidade.parent) }
                if (localidade && localidade.parent) { locais.push(localidade.parent.parent) }

                this.locais = locais.filter(Boolean).reverse();    
            });

        this.isHeaderStatic = this._scrollTop$.debounceTime(100).map(scrollTop => scrollTop > 100).distinctUntilChanged();

        //verifica se o componente de detalhes está aberto (mobile)
        /* this._route.queryParams.subscribe(params => {
             if (params['detalhes'] == 'true') {
                 this.menuAberto = true;
             } else {
                 this.menuAberto = false;
             }
         });*/
        //marca a opção no menu, baseado na rota

        this._routerParams.params$.subscribe(({ params, queryParams }) => {
            this.itemSelecionado = params.pesquisa ? 'pesquisa' : 'panorama';
            this.menuAberto = queryParams['detalhes'] == 'true';
        });
    }

    ngOnDestroy() {
        this._localidade$$.unsubscribe();
    }

    getLink(str) {
        return this.localidadeSelecionada
            ? this.localidadeSelecionada.link + '/' + str
            : '/brasil/' + str;
    }

    handleSeletorAberto(seletorAberto) {
        this.menuAberto = seletorAberto;
        this.abrirMenuPesquisa = false;
    }

    handleCloseMenu($event) {
        this.abrirMenuPesquisa = false;
    }

}