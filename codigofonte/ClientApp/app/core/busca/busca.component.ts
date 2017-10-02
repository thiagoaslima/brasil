import { Component, OnInit, Renderer, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import { AppState } from '../../shared2/app-state';
import { BuscaService } from './busca.service';
import { BuscaCompletaService } from './busca-completa.service';
import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { Localidade } from '../../shared2/localidade/localidade.model';

import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'busca',
    templateUrl: 'busca.template.html',
    styleUrls: ['busca.style.css']
})
export class BuscaComponent implements OnInit {

    @ViewChild('campoBusca') campoBusca: ElementRef;

    @Input() URLEnd = '';

    modoDigitacao = false;
    menuAberto = false;
    termo;

    resultadoBusca: ItemResultado[] = [];

    resultadoPesquisas: ItemResultado[] = [];
    resultadoLocais: ItemResultado[] = [];
    resultadoTodos: ItemResultado[] = [];
    qtdLocais: number = 0;
    qtdPesquisas: number = 0;

    categoria: number = 0;
    carregando = false;

    resultados = [];
    numResultados = 0;

    private _qtdMinimaCaracteres = 2;
    private _localidadeAtual;

    @Output() buscaAberta = new EventEmitter();

    constructor(
        private _renderer: Renderer,
        private _buscaService: BuscaService,
        private _buscaCompletaService: BuscaCompletaService,
        private _appState: AppState
    ) { }

    ngOnInit(){
        this._appState.observable$
            .subscribe(localidade => this._localidadeAtual = localidade);

        Observable.fromEvent<KeyboardEvent>(this.campoBusca.nativeElement, "keyup")
            .debounceTime(400)
            .distinctUntilChanged()
            .map(e => e.target['value'])
            .filter(value => value.length >= this._qtdMinimaCaracteres)
            .subscribe(texto => {
                this.menuAberto = true;
                this.resultados = this._buscaCompletaService.search(texto);
                this.numResultados = (this.resultados.length > 0 && this.resultados[0].type == "mensagem") ? 0 : this.resultados.length;
            });
    }

    ativarBusca() {

        this.modoDigitacao = true;

        if (this.resultadoBusca.length > 0) {

            this.menuAberto = true;
        } else {

            this.menuAberto = false;
        }

        this.buscaAberta.emit();
    }

    desativarBusca() {
        this.limparBusca();
        this.menuAberto = false;
        this.modoDigitacao = false;
    }

    limparBusca() {

        this.modoDigitacao = false;
        this.menuAberto = false;
        this.resultadoBusca = [];
        this.termo = ''
    }
}

interface ItemResultado {

    codigo?: number
    nome: string;
    tipo: string;
    categoria: number;
    destaque: string;
    link: string;
}