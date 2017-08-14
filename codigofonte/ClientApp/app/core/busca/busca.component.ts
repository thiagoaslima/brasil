import { Component, OnInit, Renderer, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import { AppState } from '../../shared2/app-state';
import { BuscaService } from './busca.service';
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

    private _qtdMinimaCaracteres = 3;
    private _localidadeAtual;

    @Output() buscaAberta = new EventEmitter();

    constructor(
        private _renderer: Renderer,
        private _buscaService: BuscaService,
        private _appState: AppState
    ) { }

    ngOnInit() {

        this._appState.observable$
            .subscribe(localidade => this._localidadeAtual = localidade);

        Observable.fromEvent<KeyboardEvent>(this.campoBusca.nativeElement, "keyup")
            .debounceTime(400)
            .distinctUntilChanged()
            .map(e => e.target['value'])
            .filter(value => value.length >= this._qtdMinimaCaracteres)
            .flatMap(termo => {

                this.menuAberto = true;
                this.carregando = true;

                return this._buscaService.search(termo);
            })
            .subscribe(resultados => this.list(resultados));

    }


    list(resultado) {

        this.resultadoBusca = [];
        this.resultadoPesquisas = [];
        this.resultadoLocais = [];
        this.resultadoTodos = [];

        let pesquisas: Pesquisa[] = resultado.pesquisas;
        let localidades: Localidade[] = resultado.localidades;

        this.qtdPesquisas = pesquisas.length;
        pesquisas.map(pesquisa => {

            let itemResultado: ItemResultado = {

                nome: pesquisa.nome,
                tipo: pesquisa.descricao,
                categoria: 1,
                destaque: '',
                link: this._localidadeAtual.localidade.link + '/pesquisa/' + pesquisa.id
            };

            this.resultadoPesquisas.push(itemResultado);
        });

        this.qtdLocais = localidades.length;
        localidades.map(localidade => {

            let tipo = '';
            let destaque = '';
            let link = '';

            if (localidade.tipo == 'uf') {

                tipo = 'Estado';
                link = '/brasil/' + localidade.sigla.toLowerCase();
            }

            if (localidade.tipo == 'municipio') {

                tipo = 'Município';
                destaque = localidade.parent.sigla;
                link = '/brasil/' + localidade.parent.sigla.toLowerCase() + '/' + localidade.identificador;
            }

            let itemResultado: ItemResultado = {

                codigo: localidade.codigo,
                nome: localidade.nome,
                tipo: tipo,
                categoria: 2,
                destaque: destaque,
                link: link
            };
            
            this.resultadoLocais.push(itemResultado);
        });

        this.resultadoTodos = this.resultadoPesquisas.concat(this.resultadoLocais);

        this.selecionarCategoria(this.categoria);
        this.carregando = false;
    }

    selecionarCategoria(categoria) {

        this.categoria = categoria;

        switch (categoria) {

            case 1:
                this.resultadoBusca = this.resultadoPesquisas;
                break;
            case 2:
                this.resultadoBusca = this.resultadoLocais;
                break;
            default:
                this.resultadoBusca = this.resultadoTodos;
                break;
        }
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