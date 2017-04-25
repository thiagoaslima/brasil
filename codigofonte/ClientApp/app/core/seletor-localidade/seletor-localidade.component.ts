import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

import { isBrowser } from 'angular2-universal';

import { AppState } from '../../shared2/app-state';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { slugify } from '../../utils/slug';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

@Component({
    selector: 'seletor-localidade',
    templateUrl: 'seletor-localidade.template.html',
    styleUrls: ['seletor-localidade.styles.css'],
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

    private hist = null; //guarda a referência para o objeto 'history' do browser

    public isBrowser = isBrowser;

    public listaMunicipios = {
        maisVistos: <Localidade[]>[],
        base: <Localidade[]>[],
        atual: <Localidade[]>[],
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

            this.atual = Object.keys(hash).sort().map(letter => {
                return {
                    letter,
                    municipios: hash[letter]
                }
            });

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
        "estados": false,
        "municipios": false,
        "municipiosTodos": false,
        "municipiosEstados": false,
        "municipiosMunicipios": false
    };

    private _stateSelecionado = '';
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


    constructor(
        private _appState: AppState,
        private _localidadeService: LocalidadeService2,
        private pageScrollService: PageScrollService
    ) {
        this.selecaoLocalidadesAtual = this._appState.observable$
            .map(({ localidade }) => {
                const locais = [localidade];
                if (localidade) { locais.push(localidade.parent); }
                if (localidade && localidade.parent) { locais.push(localidade.parent.parent); }
                
                return locais.filter(Boolean).reverse();
            });

        this.ufs = this._localidadeService.getUfs().sort((a, b) => a.nome < b.nome ? -1 : 1);
        this.listaMunicipios.maisVistos = this.ufs.map(uf => uf.capital).sort((a, b) => a.slug < b.slug ? -1 : 1);
    }


    ngOnInit() {
        this._selecionada$$ = this._appState.observable$.pluck('localidade')
            .distinctUntilChanged()
            .subscribe(_ => {
                this.fecharSeletor();
            });

        this._buscaInput$$ = Observable.fromEvent<KeyboardEvent>(this.buscaInput.nativeElement, "keyup")
            .debounceTime(400)
            .distinctUntilChanged()
            .map(e => e.target['value'])
            .filter((termo: string) => !!termo && termo.length >= 3)
            .subscribe(termo => this.search(termo));
    }

    ngOnDestroy() {
        this._selecionada$$.unsubscribe();
        this._buscaInput$$.unsubscribe();
    }

    //'popstate' é o evento gerado ao usar o botão de voltar do browser
    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        //ao voltar no browser, se o seletor de localidade estiver aberto, fecha
        this.fecharSeletor();
    }

    @HostListener('window:mousedown', ['$event'])
    onMouseDown(event) {
        //guarda a referência da Window do browser (melhorar a forma de pegar essa referência???)
        this.hist = event.view && event.view.history ? event.view.history : null;
    }

    abrirSeletor() {
        //insere um state fake(apenas uma vez) para fazer com que o voltar do browser feche o seletor de locais (não volte para a página anterior do histórico)
        if (this.hist && !(this.hist.state && this.hist.state.seletor_localidade))
            this.hist.pushState({ seletor_localidade: true }, '', '');

        this.aberto = true;
        this.setState('municipiosTodos');
        this.isSeletorAberto.emit(true);
    }

    fecharSeletor() {
        this.setState('');
        this.aberto = false;
        this.isSeletorAberto.emit(false);
        this.clearSearch();
        this.selecionarLocalidade.nativeElement.scrollTop = '0';
    }

    setState(stateName: string, uf = null) {
        this.stateSelecionado = stateName;
        this.ufSelecionada = uf;
        this.search(this.buscaInput.nativeElement.value);
        //this.clearSearch();


        if (this.isBrowser) {
            //scroll to top ao selecionar uf
            this.pageScrollService.stopAll();
            var pos = window.pageYOffset;
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
            if (termo.length >= 3) //mostra o resultado da busca
                return this.listaMunicipios.build(this.ufSelecionada.children, termo);
            if (termo.length == 0) //mostra a lista inicial
                return this.listaMunicipios.build(this.ufSelecionada.children);
        } else {
            if (termo.length >= 3) //mostra o resultado da busca
                return this.listaMunicipios.build(this.listaMunicipios.base, termo);
            if (termo.length == 0) //mostra a lista inicial
                return this.listaMunicipios.build(this.listaMunicipios.base);
        }
    }

    clearSearch() {
        this.buscaInput.nativeElement.value = null;
    }

    voltarMobile() {
        if (this.states.municipios || this.states.estados) {
            this.setState('');
        } else {
            this.fecharSeletor();
        }
    }

    focusBuscaInputMobile() {
        this.selecionarLocalidade.nativeElement.scrollTop = '246';
    }
}