import { Component, OnInit } from '@angular/core';

import { AppState } from '../shared/app-state';
import { PANORAMA } from './configuration/panorama.configuration';
import { PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from './configuration/panorama.model';
import { Localidade } from '../shared2/localidade/localidade.model';
import { Indicador, EscopoIndicadores } from '../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../shared2/indicador/indicador.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';

@Component({
    selector: 'panorama',
    templateUrl: 'panorama.template.html'

})
export class PanoramaComponent implements OnInit {
    localidade$: Observable<Localidade>
    panorama$;

    constructor(
        private _appState: AppState,
        private _indicadorService: IndicadorService2
    ) { }

    ngOnInit() {
        this.localidade$ = this._appState.observable$.map(state => state.localidade).filter(Boolean).distinctUntilKeyChanged('codigo');

        const configuracao$: Observable<{ temas: string[], indicadores: PanoramaConfigurationItem[] }> = this._appState.observable$
            .distinctUntilKeyChanged('tipo', (a, b) => a !== b)
            .scan((acc, state) => {
                return Object.assign(acc, PANORAMA[state.tipo])
            }, { temas: [] as string[], indicadores: [] as PanoramaConfigurationItem[] })
            .map(config => {
                config.indicadores = config.indicadores.map(obj => new PanoramaConfigurationItem(obj));
                return config;
            });
            

        const groupByPesquisa$ = configuracao$.map(config => this._groupIndicadoresByPesquisa(config));
        const indicadores$ = groupByPesquisa$.combineLatest(this.localidade$)
            .flatMap(([obj, localidade]) => Observable.from(obj.map(({ pesquisaId, indicadoresId }) => ({ pesquisaId, indicadoresId, codigoLocalidade: localidade.codigo }))))
            .flatMap(obj => this._indicadorService.getIndicadoresById(obj.pesquisaId, obj.indicadoresId, EscopoIndicadores.proprio, obj.codigoLocalidade))

        const setConfiguracaoBasica$ = configuracao$.map(config => configState => Object.assign(configState, config));
        const updateIndicadoresOnConfiguracao$ = indicadores$.map(indicadores => configState => {
            indicadores.forEach(indicador => {
               const item = configState.indicadores.find(ind => ind.indicadorId === indicador.id);
               item.indicador = indicador;
                if (!item.titulo) { item.titulo = indicador.nome }
                if (!item.unidade) { item.unidade = indicador.unidade.toString() }
            });

            return configState;
        })


        this.panorama$ = Observable.merge(
            setConfiguracaoBasica$,
            updateIndicadoresOnConfiguracao$
        ).scan( (configState, fn) => fn(configState), {temas: [], indicadores: []})
        .map(configState => {
            const temas = this._buildHashTemas(configState);
            return configState.temas.map(tema => temas[tema]).filter(Boolean);;
        })
         

    }

    private _groupIndicadoresByPesquisa({ indicadores = [] as PanoramaConfigurationItem[] }): Array<{ pesquisaId: number, indicadoresId: number[] }> {
        const hash = indicadores.reduce((acc, item) => {
            if (!acc[item.pesquisaId]) { acc[item.pesquisaId] = []; }
            acc[item.pesquisaId].push(item.indicadorId);
            return acc;
        }, Object.create(null) as { [idx: number]: number[] });

        return Object.keys(hash).map(key => ({
            pesquisaId: parseInt(key, 10),
            indicadoresId: hash[key]
        }));
    }

    private _buildHashTemas({ indicadores = [] as PanoramaConfigurationItem[] }): { [tema: string]: PanoramaItem } {
        return indicadores.reduce((acc, item) => {
            if (!acc[item.tema]) { acc[item.tema] = { tema: item.tema, painel: [], graficos: [] } }

            if (item.visualizacao === PanoramaVisualizacao.painel) {
                acc[item.tema].painel.push(item);
            } else {
                acc[item.tema].graficos.push(item);
            }

            return acc;
        }, Object.create(null))
    }
}