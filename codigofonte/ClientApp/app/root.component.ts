import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';

import { isBrowser } from 'angular2-universal'

import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { AppState } from './shared2/app-state';
import { RouterParamsService } from './shared/router-params.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import {TituloBrowserComponent} from './core/titulo-browser/titulo-browser.component'
import { Localidade } from './shared2/localidade/localidade.model';


import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'root',
    templateUrl: './root.template.html',
    styles: [`
    .position_fixed {
      position: fixed;
    }
  `]
    
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

    public versao = require('./version.json');

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
        private _routerParams: RouterParamsService,
        private router: Router,
        private pageScrollService: PageScrollService
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
            //seta o item do menu selecionado
            if(isBrowser){
                let url = window.location.href;
                if(url.indexOf('panorama') >= 0){
                    this.itemSelecionado = 'panorama';
                }else if(url.indexOf('historico') >= 0){
                    this.itemSelecionado = 'historico';
                }else if(url.indexOf('pesquisa') >= 0){
                    this.itemSelecionado = 'pesquisa';
                }
            }
            
            this.menuAberto = queryParams['detalhes'] == 'true';
        });

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            //scroll to top ao carregar página
            if(isBrowser){
                this.pageScrollService.stopAll();
                // var scrollToTop = window.setInterval(function () {
                    var pos = window.pageYOffset;
                    if (pos > 0) {
                        window.scrollTo(0, -pos); // how far to scroll on each step
                    } else {
                        // window.clearInterval(scrollToTop);
                    }
                // }, 16); // how fast to scroll (this equals roughly 60 fps)
            }
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

    navegarPara(localidade: Localidade){

        let url = this.router.url.split('/');
        url[3] = localidade.parent.sigla.toLowerCase();
        url[4] = localidade.slug;

        this.router.navigateByUrl(url.join('/'));
    }

}