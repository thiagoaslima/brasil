import { Component } from '@angular/core';

import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service'
import { EscopoIndicadores, Indicador } from '../../shared2/indicador/indicador.model'
import { IndicadorService2 } from '../../shared2/indicador/indicador.service'
import { ResultadoService2 } from '../../shared2/resultado/resultado.service'
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service'

@Component({
    selector: 'resultado-component',
    templateUrl: 'resultado-teste.template.html'
})
export class ResultadoTesteComponent {
    resultado;

    constructor(
        private _pesquisaService: PesquisaService2,
        private _indicadorService: IndicadorService2,
        private _localidadeService: LocalidadeService2,
        private _resultadoService: ResultadoService2
    ) {
        const indicador$ = this._indicadorService.getIndicadoresByPosicao(13, "1.1", EscopoIndicadores.proprio).map(arr => arr[0]);
        const local = this._localidadeService.get(330455)[0];

        indicador$.subscribe(indicador => {
            this.resultado = this._resultadoService.getResultados(indicador.pesquisaId, indicador.posicao, local.codigo.toString())
                .map(resultado => resultado[0]);
        })
    }
}