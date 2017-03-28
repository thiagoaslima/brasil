import { Component } from '@angular/core';

import { PesquisaService } from '../../shared2/pesquisa/pesquisa.service'
import { EscopoIndicadores, Indicador } from '../../shared2/indicador/indicador.model'
import { IndicadorService } from '../../shared2/indicador/indicador.service'
import { ResultadoService } from '../../shared2/resultado/resultado.service'
import { LocalidadeService } from '../../shared2/localidade/localidade.service'

@Component({
    selector: 'resultado-component',
    templateUrl: 'resultado-teste.template.html'
})
export class ResultadoTesteComponent {
    resultado;

    constructor(
        private _pesquisaService: PesquisaService,
        private _indicadorService: IndicadorService,
        private _localidadeService: LocalidadeService,
        private _resultadoService: ResultadoService
    ) {
        const indicador$ = this._indicadorService.getIndicadoresByPosicao(13, "1.1", EscopoIndicadores.proprio).map(arr => arr[0]);
        const local = this._localidadeService.get(330455)[0];

        indicador$.subscribe(indicador => {
            this.resultado = this._resultadoService.getResultados(indicador.pesquisaId, indicador.posicao, local.codigo.toString())
                .map(resultado => resultado[0]);
        })
    }
}