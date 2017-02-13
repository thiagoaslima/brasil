import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { BuscaService } from './busca.service';
import { Indicador, Pesquisa } from '../../shared/pesquisa/pesquisa.interface';
import { Localidade } from '../../shared/localidade/localidade.interface';

@Component({
    selector: 'busca',
    templateUrl: 'busca.template.html',
    styleUrls: ['busca.style.css']
})
export class BuscaComponent implements OnInit {

    @ViewChild('campoBusca') campoBusca: ElementRef;

    modoDigitacao = false;
    menuAberto = false;

    resultadoBusca: ItemResultado[] = [];

    resultadoIndicadores: ItemResultado[] = [];
    resultadoPesquisas: ItemResultado[] = [];
    resultadoLocais: ItemResultado[] = [];
    resultadoTodos: ItemResultado[] = [];
    qtdIndicadores: number;
    qtdLocais: number;
    qtdPesquisas: number;

    categoria: number = 0;


    qtdMinimaCaracteres = 3;

    constructor(
        private _renderer: Renderer,
        private _buscaService: BuscaService
    ) { }

    ngOnInit() {

        Observable.fromEvent<KeyboardEvent>(this.campoBusca.nativeElement, "keyup")
            .debounceTime(400)
            .distinctUntilChanged()
            .map(e => e.target['value'])
            .filter(value => value.length >= this.qtdMinimaCaracteres)
            .flatMap(termo => this._buscaService.search(termo))
            .subscribe(resultados => this.list(resultados));
    }


    list(resultado) {

        this.resultadoBusca = [];
        this.resultadoIndicadores = [];
        this.resultadoPesquisas = [];
        this.resultadoLocais = [];
        this.resultadoTodos = [];

        let indicadores: Indicador[] = resultado.indicadores;
        let pesquisas: Pesquisa[] = resultado.pesquisas;
        let localidades: Localidade[] = resultado.localidades;

        this.qtdIndicadores = indicadores.length;
        indicadores.map(indicador => {

            let itemResultado: ItemResultado = {

                nome: indicador.indicador,
                tipo: indicador.pesquisa.nome,
                categoria: 1,
                destaque: '',
                link: 'sintese/' + indicador.id
            };

            this.resultadoIndicadores.push(itemResultado);
        });

        this.qtdPesquisas = pesquisas.length;
        pesquisas.map(pesquisa => {

            let itemResultado: ItemResultado = {

                nome: pesquisa.nome,
                tipo: pesquisa.descricao,
                categoria: 2,
                destaque: '',
                link: 'pesquisas/' + pesquisa.id
            };

            this.resultadoPesquisas.push(itemResultado);
        });

        this.qtdLocais = localidades.length;
        localidades.map(localidade => {

            let tipo = '';
            let destaque = '';
            let link = '';

            if(localidade.tipo == 'uf'){

                tipo = 'Estado';
                link = '/brasil/' + localidade.sigla.toLowerCase();
            } 

            if(localidade.tipo == 'municipio'){

                tipo = 'Município';
                destaque = localidade.parent.sigla;
                link = '/brasil/' + localidade.parent.sigla.toLowerCase() + '/' + localidade.identificador;
            }

            let itemResultado: ItemResultado = {

                nome: localidade.nome,
                tipo: tipo,
                categoria: 3,
                destaque: destaque,
                link: link
            };

            this.resultadoLocais.push(itemResultado);
        });

        this.resultadoTodos = this.resultadoIndicadores.concat(this.resultadoPesquisas.concat(this.resultadoLocais));

        this.selecionarCategoria();
        this.menuAberto = true;
    }

    selecionarCategoria(){

        switch (this.categoria) {

            case 1:
                this.resultadoBusca = this.resultadoIndicadores;
                break;
            case 2:
                this.resultadoBusca = this.resultadoPesquisas;
                break;
            case 3:
                this.resultadoBusca = this.resultadoLocais;  
                break;
            default:
                this.resultadoBusca = this.resultadoTodos;
                break;
        }
    }

}


interface ItemResultado {

    nome: string;
    tipo: string;
    categoria: number;
    destaque: string;
    link: string;
}