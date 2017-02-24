import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Localidade } from '../../shared/localidade/localidade.interface';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { slugify } from '../../utils/slug';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

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
    private _buscaInput$$: Subscription;
    private _selecionada$$: Subscription;

    public ufs: Localidade[] = [];
    public selecaoLocalidadesAtual: Observable<Localidade[]>;

    private _ufSelecionada = null;
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

            this.totalAtual = this.atual.reduce( (sum, obj) => sum + obj.municipios.length, 0);
        }
    };

    set ufSelecionada(uf) {
        this._ufSelecionada = uf;
        if (uf) {
            this.listaMunicipios.build(uf.children);
        } else {
            this.listaMunicipios.build([]);
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
        private _localidadeService: LocalidadeService
    ) {
        this.selecaoLocalidadesAtual = this._localidadeService.tree$;
        this.ufs = this._localidadeService.getUfs();
        this.listaMunicipios.maisVistos = this.ufs.map(uf => uf.capital).sort((a, b) => a.slug < b.slug ? -1 : 1);
    }


    ngOnInit() {
        this._selecionada$$ = this._localidadeService.selecionada$
            .distinctUntilChanged()
            .subscribe(_ => {
                this.fecharSeletor();
            });

        this._buscaInput$$ = Observable.fromEvent<KeyboardEvent>(this.buscaInput.nativeElement, "keyup")
            .debounceTime(400)
            .distinctUntilChanged()
            .map(e => e.target['value'])
            .filter(value => value.length >= 3)
            .subscribe(termo => this.search(termo));
    }

    ngOnDestroy() {
        this._selecionada$$.unsubscribe();
        this._buscaInput$$.unsubscribe();
    }

    abrirSeletor() {
        this.aberto = true;
        this.setState('municipiosTodos');
        this.isSeletorAberto.emit(true);
    }

    fecharSeletor() {
        this.setState('');
        this.aberto = false;
        this.isSeletorAberto.emit(false);
    }

    setState(stateName: string, uf = null) {
        this.stateSelecionado = stateName;
        this.ufSelecionada = uf;
    }

    search(termo) {
        return this.listaMunicipios.build(this.listaMunicipios.base, termo);
    }

    voltarMobile() {
        if (this.states.municipios || this.states.estados) {
            this.setState('');
        } else {
            this.fecharSeletor();
        }
    }
}