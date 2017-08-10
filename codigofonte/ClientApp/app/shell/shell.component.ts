import { Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { isBrowser } from 'angular2-universal';

import { PageScrollService } from 'ng2-page-scroll';
import { AppState } from '../shared2/app-state';
import { RouterParamsService } from '../shared/router-params.service';

import { Localidade } from '../shared2/localidade/localidade.model';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'shell',
    templateUrl: './shell.component.html',
    styles: [`
    .position_fixed {
      position: fixed;
    }
    .aside_recolhido {
        transform: translateX(-200px);
        transition: transform 1s;
    }
    .aside_recolhido:hover {
        transform: translateX(0);
        transition: transform 1s;
    }
    .aside_recolhido #localidade {
        padding-right: 50px;
    }
    @media screen and (min-width: 768px) and (max-width: 1120px){
        .aside_recolhido {
            transform: translateX(-85%);
            transition: transform 1s;
        }
        .aside_recolhido #localidade {
            padding-right: 20px;
        }
    }
    @media screen and (max-width: 768px){
        .aside_recolhido {
            display: none;
        }
    }
  `]
})
export class ShellComponent implements OnInit, OnDestroy {
    @ViewChild('abreMenuGlobal') button: ElementRef;
    @ViewChild(RouterOutlet) routerOutlet: RouterOutlet;

    public locais = [];
    public localidadeSelecionada = null;
    public isHeaderStatic;
    public menuGlobalAberto = false;
    public menuAberto = false;
    public abrirMenuPesquisa = false;
    public itemSelecionado;
    public isHome = false;

    public versao = require('../version.json');

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

        // marca a opção no menu, baseado na rota

        this._routerParams.params$.subscribe(({ params, queryParams }) => {
            // seta o item do menu selecionado
            if (isBrowser) {
                let url = this.router.url;
                if (url.indexOf('panorama') >= 0) {
                    this.itemSelecionado = 'panorama';
                    this.isHome = false;
                } else if (url.indexOf('historico') >= 0) {
                    this.itemSelecionado = 'historico';
                    this.isHome = false;
                } else if (url.indexOf('pesquisa') >= 0 && params.uf) {
                    this.itemSelecionado = 'pesquisa';
                    this.isHome = false;
                } else {
                    this.itemSelecionado = '';
                    this.isHome = true;
                }
            }

            this.menuAberto = queryParams['detalhes'] === 'true';
        });

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            // scroll to top ao carregar página
            if (isBrowser) {
                this.pageScrollService.stopAll();
                // var scrollToTop = window.setInterval(function () {
                let pos = window.pageYOffset;
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

    navegarPara(localidade: Localidade) {

        let url = this.router.url.split('/');
        url[3] = localidade.parent.sigla.toLowerCase();
        url[4] = localidade.slug;

        this.router.navigateByUrl(url.join('/'));
    }

}
