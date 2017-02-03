import { Component } from '@angular/core';

import { SinteseService } from '../sintese/sintese.service';

@Component({
    selector: 'sandbox',
    templateUrl: 'sandbox.component.html'
})
export class SandboxComponent{ 

    titulo = 'Teste';

    listaPesquisas;
    listaIndicadores;
    listaValores;
    listaResultado;
    sinteseLocal;
    detalhesIndicadorSintese;
    pesquisaPorIndicador;

    constructor(private _service$: SinteseService){


        _service$.getPesquisasDisponiveis().subscribe(pesquisas => this.listaPesquisas = JSON.stringify(pesquisas));
        _service$.getNomesPesquisa('42').subscribe(pesquisas => this.listaIndicadores = JSON.stringify(pesquisas));
        _service$.getDadosPesquisa('42', '330455', ['30280']).subscribe(pesquisas => this.listaValores = JSON.stringify(pesquisas));
        _service$.getPesquisa('23', '330455').subscribe(pesquisas => this.listaResultado = JSON.stringify(pesquisas));
        _service$.getSinteseLocal('330455').subscribe(pesquisas => this.sinteseLocal = JSON.stringify(pesquisas));
        _service$.getDetalhesIndicadorSintese('330455', '29171').subscribe(pesquisas => this.detalhesIndicadorSintese = JSON.stringify(pesquisas));
        this.pesquisaPorIndicador = JSON.stringify(_service$.getPesquisaByIndicadorDaSinteseMunicipal('47001'));
    }

}
