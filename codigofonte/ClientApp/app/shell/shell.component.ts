import { Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
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
    .bt-home {
        background-color: transparent;
        border: 1px solid #fff;
        border-radius: 21px;
        font-size: 1em;
        padding: 5px 10px;
        cursor: pointer;
        float: left;
        border-color: #1b779b;
        margin-top: 12px;
        margin-left: 12px;
        font-size: 0.9em;

        -webkit-transition: background 200ms ease, color 200ms ease;
        -moz-transition: background 200ms ease, color 200ms ease;
        -ms-transition: background 200ms ease, color 200ms ease;
        -o-transition: background 200ms ease, color 200ms ease;
        transition: background 200ms ease, color 200ms ease;
    }

    .bt-home i{
        color: #1b779b;
        margin-right:10px;
        font-size: 1.1em;

        -webkit-transition: color 200ms ease;
        -moz-transition: color 200ms ease;
        -ms-transition: color 200ms ease;
        -o-transition: color 200ms ease;
        transition: color 200ms ease;
    }

    .bt-home:hover {
        background-color: #1b779b;
        color: #fff;
    }

    .bt-home:hover i{
        color:#fff;
    }

    .position_fixed {
      position: fixed;
    }
    .aside_recolhido {
        transform: translateX(-185px);
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

        .bt-home {
            display:none;
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
    //Indicará às redes sociais propriedades da página a ser compartilhada
    public propriedadesCompartilhamento = <any>{};

    public versao = require('../version.json');

    public isBrowser = isBrowser;

    private _localidade$$: Subscription;
    private _scrollTop$ = new BehaviorSubject(0);

    historicoHabilitado = true;

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
        private pageScrollService: PageScrollService,
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
        let view = this;
        this._routerParams.params$.subscribe(({ params, queryParams }) => {
            // seta o item do menu selecionado
            if (isBrowser) {
                let url = this.router.url;
                
                let titulo = document.title;
                console.log(titulo);
                if(titulo!=null){

                        view.propriedadesCompartilhamento = JSON.stringify({title:titulo});
                }
                console.log(view.propriedadesCompartilhamento);
                
                if (url.indexOf('panorama') >= 0) {
                    this.itemSelecionado = 'panorama';
                    this.isHome = false;
                } else if (url.indexOf('historico') >= 0) {
                    this.itemSelecionado = 'historico';
                    this.isHome = false;
                } else if (url.indexOf('pesquisa') >= 0 && url.indexOf('brasil') >= 0) {
                    this.itemSelecionado = 'pesquisa';
                    this.isHome = false;
                } else {
                    this.itemSelecionado = '';
                    this.isHome = true;
                }

                // desabilita o botão de 'histórico e fotos' no 'brasil'
                // verifica se depois do 'brasil', na url, vem a sigla de um estado (duas letras),
                // se não, significa que está no 'brasil' e desabilita o historico
                let url2 = url.split('/');
                if (url2[url2.indexOf('brasil') + 1].length > 2) {
                    this.historicoHabilitado = false;
                } else {
                    this.historicoHabilitado = true;
                }
                // -----
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

        this.router.navigateByUrl(localidade.link);
    }

}
