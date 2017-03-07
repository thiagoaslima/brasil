import { Component, OnInit } from '@angular/core';

import { SinteseService } from '../sintese/sintese.service';
import { PesquisaService } from '../shared/pesquisa/pesquisa.service.2';

import { reduceOnTree } from '../utils/flatFunctions';

@Component({
    selector: 'sandbox',
    templateUrl: 'sandbox.component.html'
})
export class SandboxComponent implements OnInit {

    titulo = 'Teste';

    listaPesquisas;
    listaIndicadores;
    listaValores;
    listaResultado;
    sinteseLocal;
    detalhesIndicadorSintese;
    pesquisaPorIndicador;

    censo;
    pesquisas;
    indicadoresEducacao;
    getIndicadores2;
    resultados;


    constructor(
        private _service$: SinteseService,
        private _pesquisaService: PesquisaService
    ) {


        _service$.getPesquisasDisponiveis().subscribe(pesquisas => this.listaPesquisas = JSON.stringify(pesquisas));
        _service$.getNomesPesquisa('42').subscribe(pesquisas => this.listaIndicadores = JSON.stringify(pesquisas));
        _service$.getDadosPesquisa('42', '330455', ['30280']).subscribe(pesquisas => this.listaValores = JSON.stringify(pesquisas));
        _service$.getPesquisa('23', '330455').subscribe(pesquisas => this.listaResultado = JSON.stringify(pesquisas));
        _service$.getSinteseLocal('330455').subscribe(pesquisas => this.sinteseLocal = JSON.stringify(pesquisas));
        _service$.getDetalhesIndicadorSintese('330455', '29171').subscribe(pesquisas => this.detalhesIndicadorSintese = JSON.stringify(pesquisas));
        this.pesquisaPorIndicador = JSON.stringify(_service$.getPesquisaByIndicadorDaSinteseMunicipal('47001'));
    }

    ngOnInit() {
        this._pesquisaService.getPesquisa(23).subscribe(pesquisa => {
            this.censo = pesquisa;
        });

        this.pesquisas = this._pesquisaService.getAllPesquisas().map(pesquisas => pesquisas.map(pesquisa => pesquisa.nome));
    }

}
