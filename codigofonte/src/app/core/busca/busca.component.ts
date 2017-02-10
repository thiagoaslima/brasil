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
    qtdIndicadores: number;
    qtdLocais: number;
    qtdPesquisas: number;

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
            .filter(value => value.length > this.qtdMinimaCaracteres)
            .take(20)
            .flatMap(termo => this._buscaService.search(termo))
            .subscribe(resultados => this.list(resultados));
    }


    list(resultado) {
        this.resultadoBusca = [];

        let indicadores: Indicador[] = resultado.indicadores;
        let pesquisas: Pesquisa[] = resultado.pesquisas;
        let localidades: Localidade[] = resultado.localidades;

        this.qtdIndicadores = indicadores.length;
        indicadores.map(indicador => {

            let itemResultado: ItemResultado = {

                nome: indicador.indicador,
                tipo: indicador.pesquisa.nome,
                categoria: Categoria.INDICADOR,
                destaque: ''
            };

            this.resultadoBusca.push(itemResultado);
        });

        this.qtdPesquisas = pesquisas.length;
        pesquisas.map(pesquisa => {

            let itemResultado: ItemResultado = {

                nome: pesquisa.nome,
                tipo: pesquisa.descricao,
                categoria: Categoria.PESQUISA,
                destaque: ''
            };

            this.resultadoBusca.push(itemResultado);
        });

        this.qtdLocais = localidades.length;
        localidades.map(localidade => {

            let itemResultado: ItemResultado = {

                nome: localidade.nome,
                tipo: 'Localidade',
                categoria: Categoria.LOCAL,
                destaque: localidade.tipo == 'municipio' ? localidade.parent.sigla : ''
            };

            this.resultadoBusca.push(itemResultado);
        });

        this.menuAberto = true;
    }


    // let resultado: ItemResultado[] = [
    //     {
    //         nome: 'Ovos de galinha',
    //         tipo: 'Pecuária Abate',
    //         categoria: Categoria.INDICADOR,
    //         destaque: ''
    //     },
    //     {
    //         nome: 'Porto de Galinha',
    //         tipo: 'Lacalidade',
    //         categoria: Categoria.INDICADOR,
    //         destaque: 'PE'
    //     },
    //     {
    //         nome: 'Galináceosa',
    //         tipo: 'Pecuária Abate',
    //         categoria: Categoria.INDICADOR,
    //         destaque: ''
    //     }

    // ];

    // this.qtdIndicadores = 2;
    // this.qtdLocais = 1;
    // this.qtdPesquisas = 0;

    // this.resultadoBusca = resultado;

    // this.menuAberto = true;

}


enum Categoria {

    INDICADOR,
    PESQUISA,
    LOCAL
}

class ItemResultado {

    nome: string;
    tipo: string;
    categoria: Categoria;
    destaque: string;
}