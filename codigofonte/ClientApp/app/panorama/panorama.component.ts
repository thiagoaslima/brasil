import { Component, OnInit } from '@angular/core';

import { AppState } from '../shared/app-state';
import { PANORAMA } from './configuration/panorama.configuration';
import { PanoramaTema, PanoramaItem, PanoramaVisualizacao } from './configuration/panorama.model';
import { Localidade } from '../shared2/localidade/localidade.model';
import { Indicador, EscopoIndicadores } from '../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../shared2/indicador/indicador.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Component({
    selector: 'panorama',
    templateUrl: 'panorama.template.html'

})
export class PanoramaComponent implements OnInit {
    localidade$: Observable<Localidade>
    configuracao$: Observable<PanoramaTema[]>

    constructor(
        private _appState: AppState,
        private _indicadorService: IndicadorService2
    ) { }

    ngOnInit() {
        this.localidade$ = this._appState.observable$.map(state => state.localidade);

        this.configuracao$ = this._appState.observable$.map(state => PANORAMA[state.tipo])
            .map(configuracao => this.prepare(configuracao));
    }

    prepare({ temas, indicadores }: { temas: string[], indicadores: PanoramaItem[] }) {
        const requests = Object.create(null); indicadores.reduce((acc, item) => {
            if (!acc[item.pesquisa]) { acc[item.pesquisa] = []; }
            acc[item.pesquisa].push(item.indicador);
            return acc;
        }, Object.create(null));

        const observables = Object.keys(requests).reduce((acc, key) => {
            return acc[key] = this._indicadorService.getIndicadorById(parseInt(key, 10), requests[key], EscopoIndicadores.proprio).share()
        }, Object.create(null));

        const hash = indicadores.reduce((acc, item) => {
            if (!acc[item.tema]) { acc[item.tema] = new PanoramaTema({ nome: item.tema }) }

            const indicador$ = observables[item.pesquisa].map(indicadores => indicadores.find(indicador => indicador.id === item.indicador))

            if (item.visualizacao === PanoramaVisualizacao.painel) {
                acc[item.tema].painel.push(indicador$);
            } else {
                acc[item.tema].complementos.push({ indicador: indicador$, visualizacao: item.visualizacao })
            }

            return acc;
        }, Object.create(null) as {[idx: string]: PanoramaTema});

        return temas.map(tema => hash[tema]);
    }
}