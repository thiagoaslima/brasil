import { Component, OnInit } from '@angular/core';
import { Pesquisa, Indicador } from '../../shared3/models';
import { IndicadorService3 } from '../../shared3/services';

@Component({
    selector: 'pesquisa-cache',
    template: `
        <p>Indicadores Educação: {{ indicadoresEducacao?.join(', ') }}</p>
    `
})
export class IndicadorCacheComponent implements OnInit {
    indicadoresEducacao: string[];
    idsEducacao: number[]

    constructor(
        private _indicadorService3: IndicadorService3
    ) {}

    ngOnInit() {
        this._indicadorService3.getIndicadoresDaPesquisa(13).subscribe(indicadores => this.indicadoresEducacao = indicadores.map(indicador => indicador.nome));
        this._indicadorService3.getIndicadoresDaPesquisa(13).subscribe(indicadores => this.idsEducacao = indicadores.map(indicador => indicador.id));
    }
}