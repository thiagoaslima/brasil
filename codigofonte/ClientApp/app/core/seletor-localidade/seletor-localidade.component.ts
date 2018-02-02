import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TraducaoService } from '../../shared';
import { isPlatformBrowser } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/observable/fromEvent';

import { PageScrollService } from 'ngx-page-scroll';

import { SeletorLocalidadeService } from './seletor-localidade.service';

import {
    AppState,
    Localidade,
    IsMobileService,
    LocalidadeService3,
} from '../../shared';

import { slugify } from '../../../utils/slug';
import { ModalErrorService } from '../../core';


@Component({
    selector: 'seletor-localidade',
    templateUrl: 'seletor-localidade.component.html',
    styleUrls: ['seletor-localidade.component.css'],
    exportAs: 'seletor-localidade'
})
export class SeletorLocalidadeComponent implements OnInit, OnDestroy {
    @Input() aberto = false;
    @Output() isSeletorAberto = new EventEmitter();
    @ViewChild('buscaInput') buscaInput: ElementRef;
    @ViewChild('selecionarLocalidade') selecionarLocalidade: ElementRef;

    private _buscaInput$$: Subscription;
    private _selecionada$$: Subscription;

    public ufs: Localidade[] = [];
    public selecaoLocalidadesAtual: Observable<Localidade[]>;

    private _ufSelecionada = null;

    private hist = null; // guarda a referência para o objeto 'history' do browser

    public isBrowser ;

    public URLEnd = '';
    private _forced = false;

    public listaMunicipios = {
        maisVistos: <Localidade[]>[],
        base: <Localidade[]>[],
        atual: [],
        totalAtual: 0,

        build(array, termo = '') {

            termo = slugify(termo);

            let hash = array.reduce((agg, municipio) => {
                if (!municipio.identificador.includes(termo)) {
                    return agg;
                }

                let initialLetter = municipio.identificador.charAt(0);

                if (!agg[initialLetter]) {
                    agg[initialLetter] = [];
                }

                agg[initialLetter].push(municipio);

                return agg;
            }, {});

            this.atual = Object.keys(hash).sort().map(letter => (
                {
                    letter,
                    municipios: hash[letter]
                }
            ));

            this.totalAtual = this.atual.reduce((sum, obj) => !!obj.municipios && (sum + obj.municipios) ? obj.municipios.length : 0, 0);
        }
    };

    set ufSelecionada(uf) {
        this._ufSelecionada = uf;
        if (uf) {
            this.listaMunicipios.base = uf.children;
            this.listaMunicipios.build(uf.children);
        } else {
            this.listaMunicipios.build([]);
            this.listaMunicipios.base = this._localidadeService.getAllMunicipios();
        }

    }
    get ufSelecionada() {
        return this._ufSelecionada;
    }


    public states = {
        '': true,
        'estados': false,
        'municipios': false,
        'municipiosTodos': false,
        'municipiosEstados': false,
        'municipiosMunicipios': false
    };

    public niveisTerritoriais: any = {};

    private _stateSelecionado = '';
    private _subscriptions = [];

    set stateSelecionado(stateName) {
        if (this._stateSelecionado) {
            this.states[this._stateSelecionado] = false;
        }
        this._stateSelecionado = stateName;

        if (stateName) {
            setTimeout(() => {
                this.states.municipios = stateName.startsWith('municipios');
                this.states[stateName] = true;
            }, 10);
        } else {
            this.states.municipios = false;
        }

        if (stateName === 'municipiosTodos') {
            this.listaMunicipios.base = this._localidadeService.getAllMunicipios();
        }
    }

    get stateSelecionado() {
        return this._stateSelecionado;
    }

    public get lang() {
        return this._traducaoServ.lang;
    }
    constructor(
        private _appState: AppState,
        private _localidadeService: LocalidadeService3,
        private pageScrollService: PageScrollService,
        private _isMobileService: IsMobileService,
        private _router: Router,
        private _seletorService: SeletorLocalidadeService,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService,
        @Inject(PLATFORM_ID) platformId,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);

        let sub1 = this._seletorService.isAberto$.subscribe(isAberto => this.aberto = isAberto, this.exibirError);
        let sub2 = this._seletorService.state$.subscribe(states => this.states = states, this.exibirError);
        let sub3 = this._seletorService.niveisTerrioriais$.subscribe(niveis => this.niveisTerritoriais = niveis, this.exibirError);
        let sub4 = this._seletorService.forceURL$.subscribe(urlEnd => this.URLEnd = urlEnd, this.exibirError);

        // escuta e guarda a rota para manter o usuário na mesma página ao mudar a localidade
        // o codigo poderia ser simplificado mas é preciso ignorar tanto o início quanto os query parameters
        let sub5 = this._router.events.filter(event => event instanceof NavigationEnd).subscribe((route: NavigationEnd) => {

            if (route.url.indexOf('/panorama') >= 0) {
                this.URLEnd = '/panorama';
            } else if (route.url.indexOf('/historico') >= 0) {
                this.URLEnd = '/historico';
            } else if (route.url.indexOf('/pesquisa/') >= 0) {
                let arr = route.url.split('/');
                arr = arr.slice(arr.indexOf('pesquisa') + 1);
                if (arr.length === 1) {
                    this.URLEnd = '/pesquisa/' + arr[0];
                }
                if (arr.length === 2) {
                    this.URLEnd = '/pesquisa/' + arr[0] + '/' + arr[1].split('?')[0];
                }
            }

        },
        this.exibirError);

        this.selecaoLocalidadesAtual = this._appState.observable$
            .map(({ localidade }) => {

                const locais = [localidade];
                if (localidade) { locais.push(localidade.parent); }
                if (localidade && localidade.parent) { locais.push(localidade.parent.parent); }

                return locais.filter(Boolean).reverse();
            });

        this.ufs = this._localidadeService.getAllUfs().sort((a, b) => a.nome < b.nome ? -1 : 1);
        this.listaMunicipios.maisVistos = this.ufs.map(uf => this._localidadeService.getMunicipioByCodigo(uf.codigoCapital)).sort((a, b) => a.slug < b.slug ? -1 : 1);

        this._subscriptions.push(sub1, sub2, sub3, sub4, sub5);
    }


    ngOnInit() {
        this._selecionada$$ = this._appState.observable$.pluck('localidade')
            .distinctUntilChanged()
            .subscribe(_ => {
                this.fecharSeletor();
            },
            this.exibirError);

        this._buscaInput$$ = Observable.fromEvent<KeyboardEvent>(this.buscaInput.nativeElement, 'keyup')
            .debounceTime(400)
            .distinctUntilChanged()
            .map(e => e.target['value'])
            .filter((termo: string) => !!termo && termo.length >= 3)
            .subscribe(termo => this.search(termo), this.exibirError);
    }

    ngOnDestroy() {
        this._selecionada$$.unsubscribe();
        this._buscaInput$$.unsubscribe();
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    // 'popstate' é o evento gerado ao usar o botão de voltar do browser
    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        // ao voltar no browser, se o seletor de localidade estiver aberto, fecha
        this.fecharSeletor();
    }

    @HostListener('window:mousedown', ['$event'])
    onMouseDown(event) {
        // guarda a referência da Window do browser (melhorar a forma de pegar essa referência???)
        this.hist = event.view && event.view.history ? event.view.history : null;
    }

    abrirSeletor() {
        // insere um state fake(apenas uma vez) para fazer com que o voltar do browser
        // feche o seletor de locais (não volte para a página anterior do histórico)
        if (this.hist && !(this.hist.state && this.hist.state.seletor_localidade)) {
            this.hist.pushState({ seletor_localidade: true }, '', '');
        }

        this.aberto = true;
        // this.setState('estados');
        this._seletorService.abrirSeletor();
        this.isSeletorAberto.emit(true);
    }

    fecharSeletor() {
        this.setState('');
        this._seletorService.fecharSeletor();
        this.isSeletorAberto.emit(false);
        this.clearSearch();
        this.selecionarLocalidade.nativeElement.scrollTop = '0';
    }

    setState(stateName: string, uf = null) {
        this.stateSelecionado = stateName;
        this.ufSelecionada = uf;
        this.search(this.buscaInput.nativeElement.value);
        // this.clearSearch();


        if (this.isBrowser) {
            // scroll to top ao selecionar uf
            this.pageScrollService.stopAll();
            const pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, -pos);
            }
        }
    }

    search(termo = '') {

        if (!termo) {
            return;
        }

        if (this.ufSelecionada) {
            if (termo.length >= 3) {
                // mostra o resultado da busca
                return this.listaMunicipios.build(this.ufSelecionada.children, termo);
            }
            if (termo.length === 0) {
                // mostra a lista inicial
                return this.listaMunicipios.build(this.ufSelecionada.children);
            }
        } else {
            if (termo.length >= 3) {
                // mostra o resultado da busca
                return this.listaMunicipios.build(this.listaMunicipios.base, termo);
            }
            if (termo.length === 0) {
                // mostra a lista inicial
                return this.listaMunicipios.build(this.listaMunicipios.base);
            }
        }
    }

    clearSearch() {
        this.buscaInput.nativeElement.value = null;
    }

    voltarMobile() {
        this.fecharSeletor();
    }

    focusBuscaInputMobile() {
        if (this._isMobileService.any()) {
            this.selecionarLocalidade.nativeElement.scrollTop = '246';
        }
    }

    private exibirError(){
        this.modalErrorService.showError();
    }
}
