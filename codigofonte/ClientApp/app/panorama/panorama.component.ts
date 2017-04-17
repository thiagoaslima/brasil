import { Component, OnInit, DoCheck } from '@angular/core';

import { AppState } from '../shared2/app-state';
import { PANORAMA } from './configuration/panorama.configuration';
import { PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from './configuration/panorama.model';
import { Localidade, NiveisTerritoriais } from '../shared2/localidade/localidade.model';
import { Indicador, EscopoIndicadores } from '../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../shared2/indicador/indicador.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';

@Component({
    selector: 'panorama',
    templateUrl: 'panorama.template.html'

})
export class PanoramaComponent implements OnInit {
    localidade$: Observable<Localidade>
    resumo$: Observable<{ tema: string, indicadores: Array<{ titulo: string, unidade: string, indicador: Indicador }> }[]>;
    temas$;
    temaSelecionado;

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


        // const groupByPesquisa$ = configuracao$.map(config => this._groupIndicadoresByPesquisa(config));
        // const indicadores$ = groupByPesquisa$.combineLatest(this.localidade$)
        //     .mergeMap(([obj, localidade]) => Observable.from(obj.map(({ pesquisaId, indicadoresId }) => ({ pesquisaId, indicadoresId, codigoLocalidade: localidade.parent.codigo }))))
        //     .mergeMap((obj, idx) => this._indicadorService.getIndicadoresById(obj.pesquisaId, obj.indicadoresId, EscopoIndicadores.proprio, Localidade.alterarContexto(obj.codigoLocalidade, NiveisTerritoriais.municipio, true)));

        const groupBy$ = configuracao$.map(config => this._groupIndicadores(config));
        const indicadores$ = groupBy$.combineLatest(this.localidade$)
            .mergeMap(([obj, localidade]) => this._indicadorService.getVariosIndicadoresById(obj.indicadorMapPesquisa, obj.indicadores, Localidade.alterarContexto(localidade.parent.codigo, NiveisTerritoriais.municipio), true));


        const setConfiguracaoBasica$ = configuracao$.map(config => configState => Object.assign({}, configState, config));
        const updateIndicadoresOnConfiguracao$ = indicadores$.map(indicadores => configState => {
            const _indicadores = configState.indicadores.map(item => {
                item = Object.assign({}, item);
                const indicador = indicadores.find(indicador => indicador.id === item.indicadorId);

                if (indicador) {
                    item.indicador = indicador;
                    if (!item.titulo && indicador) { item.titulo = indicador.nome }
                    if (!item.unidade && indicador) { item.unidade = indicador.unidade.toString() }
                }
                

                if (item.grafico) {
                    item.grafico.dados = item.grafico.dados.map(grafico => {
                        grafico = Object.assign({}, grafico);
                        const indicador = indicadores.find(indicador => indicador.id === grafico.indicadorId);
                        if (indicador) { grafico.indicador = indicador; }
                        return grafico;
                    })
                }

                return item;
            });

            return {
                temas: configState.temas.slice(0),
                indicadores: _indicadores
            }
        })


        const panorama$ = Observable.merge(setConfiguracaoBasica$, updateIndicadoresOnConfiguracao$)
            .scan((configState, fn) => fn(configState), { temas: [], indicadores: [] })
            .map(configState => {
                const temas = this._buildHashTemas(configState);
                return configState.temas.map(tema => temas[tema]).filter(Boolean);;
            });

        this.resumo$ = panorama$.map(configState => {
            return configState.map(item => {
                const indicadores = Object.keys(PanoramaVisualizacao)
                    .map(key => PanoramaVisualizacao[key])
                    .reduce((acc, visualizacao) => {
                        const items = item[visualizacao].map(item => ({
                            titulo: item.titulo,
                            unidade: item.unidade,
                            indicador: item.indicador
                        }));
                        return acc.concat(items);
                    }, []);

                return {
                    tema: item.tema,
                    indicadores: indicadores.sort((a, b) => a.titulo < b.titulo ? -1 : 1)
                }
            });
        })
        // .do(console.log.bind(console, 'sent to resumo'));

        this.temas$ = panorama$
            .map(configState => {
                return configState
                    .filter(item => Boolean(item.tema))
                    .map(item => {
                        return {
                            tema: item.tema,
                            painel: item.painel,
                            grafico: item.grafico.map(item => item.grafico)
                        }
                    })
            })
            // .do(console.log.bind(console, 'sent to temas'));
    }

    private _groupIndicadoresByPesquisa({ indicadores = [] as PanoramaConfigurationItem[] }): Array<{ pesquisaId: number, indicadoresId: number[] }> {
        const hash = indicadores.reduce((acc, item) => {
            if (!acc[item.pesquisaId]) { acc[item.pesquisaId] = []; }
            acc[item.pesquisaId].push(item.indicadorId);

            if (item.grafico && item.grafico.dados && item.grafico.dados.length) {
                item.grafico.dados.forEach(item => {
                    if (!acc[item.pesquisaId]) { acc[item.pesquisaId] = []; }
                    acc[item.pesquisaId].push(item.indicadorId);
                })
            }

            return acc;
        }, Object.create(null) as { [idx: number]: number[] });

        return Object.keys(hash).map(key => ({
            pesquisaId: parseInt(key, 10),
            indicadoresId: hash[key]
        }));
    }

    private _groupIndicadores({ indicadores = [] as PanoramaConfigurationItem[] }): { indicadores:Array<number>, indicadorMapPesquisa: any } {
        let indicadoresArr = [];
        let indicadorMapPesquisa = {};
        const hash = indicadores.forEach((item) => {
            indicadoresArr.push(item.indicadorId);
            indicadorMapPesquisa[item.indicadorId.toString()] = item.pesquisaId;

            if (item.grafico && item.grafico.dados && item.grafico.dados.length) {
                item.grafico.dados.forEach(item => {
                    indicadoresArr.push(item.indicadorId);
                    indicadorMapPesquisa[item.indicadorId.toString()] = item.pesquisaId;
                })
            }
        });

        return {
            indicadores: indicadoresArr,
            indicadorMapPesquisa: indicadorMapPesquisa
        };
    }

    private _buildHashTemas({ indicadores = [] as PanoramaConfigurationItem[] }): { [tema: string]: PanoramaItem } {
        return indicadores.reduce((acc, item) => {

            if (!acc[item.tema]) {
                acc[item.tema] = Object.assign(
                    { tema: item.tema },
                    Object.keys(PanoramaVisualizacao)
                        .map(key => PanoramaVisualizacao[key])
                        .reduce((acc, key) => Object.assign(acc, { [key]: [] }), Object.create(null))
                )
            }
            acc[item.tema][item.visualizacao].push(item);

            return acc;
        }, Object.create(null))
    }

    handleTemaSelecionado(tema){
        this.temaSelecionado = tema;
    }

}