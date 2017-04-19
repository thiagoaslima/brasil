import { Component, DoCheck, group, OnDestroy, OnInit } from '@angular/core';

import { AppState } from '../shared2/app-state';
import { PANORAMA } from './configuration/panorama.configuration';
import { PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from './configuration/panorama.model';
import { Localidade, NiveisTerritoriais } from '../shared2/localidade/localidade.model';
import { Indicador, EscopoIndicadores } from '../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../shared2/indicador/indicador.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mergeMapTo';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/withLatestFrom';

@Component({
    selector: 'panorama',
    templateUrl: 'panorama.template.html'

})
export class PanoramaComponent implements OnInit, OnDestroy {
    localidade$: Observable<Localidade>
    resumo$: Observable<{ tema: string, indicadores: Array<{ titulo: string, unidade: string, indicador: Indicador }> }[]>;
    temas$;
    temaSelecionado;

    private _tipoLocalidade$$: Subscription;
    private _objLocalidade$$: Subscription;

    constructor(
        private _appState: AppState,
        private _indicadorService: IndicadorService2
    ) { }

    ngOnInit() {
        const _blankConfig = { temas: [] as string[], indicadores: [] as PanoramaConfigurationItem[] };

        const configuracaoBase$ = new BehaviorSubject(_blankConfig);
        const _localidade$ = new BehaviorSubject<Localidade>(null);
        
        this._objLocalidade$$ = this._appState.observable$
            .map(state => state.localidade)
            .filter(Boolean)
            .distinctUntilKeyChanged('codigo')
            .subscribe(localidade => _localidade$.next(localidade));
            

        this._tipoLocalidade$$ = this._appState.observable$
            .map(state => state.tipo)
            .filter(Boolean)
            .distinctUntilChanged()
            .subscribe(tipo => {
                const config = Object.assign({}, _blankConfig, PANORAMA[tipo]);
                config.indicadores = config.indicadores.map(obj => new PanoramaConfigurationItem(obj));
                configuracaoBase$.next(config);
            });

        const groupIndicadores$ = configuracaoBase$
            .filter(({indicadores}) => indicadores.length > 0)
            .map(config => this._groupIndicadores(config))

        const groupIndicadoresPainel$  = configuracaoBase$
            .filter(({indicadores}) => indicadores.length > 0)
            .map(config => config.indicadores.filter(item => item.visualizacao === PanoramaVisualizacao.painel))

        const indicadores$ = this._appState.observable$
            .map(state => state.localidade)
            .filter(Boolean)
            .distinctUntilKeyChanged('codigo')
            .withLatestFrom(groupIndicadores$)
            .filter(([localidade, obj]) => obj && obj.indicadores.length > 0)
            .mergeMap(([localidade, obj]) => {
                return this._indicadorService.getVariosIndicadoresById(obj.indicadorMapPesquisa, obj.indicadores, Localidade.alterarContexto(localidade.parent.codigo, NiveisTerritoriais.municipio), true)
            });

        const rankings$ = this._appState.observable$
            .map(state => state.localidade as Localidade)
            .filter(Boolean)
            .distinctUntilKeyChanged('codigo')
            .withLatestFrom(groupIndicadoresPainel$)
            .filter(([localidade, indicadores]) => indicadores.length > 0)
            .mergeMap( ([localidade, indicadores]) => {
                return this._indicadorService.getRankings(
                    indicadores.map(item => item.indicadorId), 
                    indicadores.map(item => item.periodo), 
                    localidade.codigo, 
                    ['BR', localidade.parent.codigo.toString()]
                );
            });

        const configuracaoFull$ = indicadores$.zip(rankings$)
            .withLatestFrom(configuracaoBase$)
            .map(([[indicadores, rankings], configuracaoBase]) => {

                const _indicadores = configuracaoBase.indicadores.map(item => {
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

                    const ranks = rankings.filter(ranking => ranking.indicador === item.indicadorId);
                    if (!item.ranking) {
                        item.ranking = ranks.reduce( (acc, ranking) => Object.assign(acc, {[ranking.contexto]: ranking}), {});
                    }

                    return item;
                });

                return {
                    temas: configuracaoBase.temas,
                    indicadores: _indicadores
                } as { temas: string[], indicadores: PanoramaConfigurationItem[] }
            })

        const configuracao$ = Observable.merge(configuracaoBase$, configuracaoFull$);

        const panorama$ = configuracao$
            .map(configState => {
                const temas = this._buildHashTemas(configState);
                return configState.temas.map(tema => temas[tema]).filter(Boolean);;
            })
            .share();

        this.resumo$ = panorama$
            .withLatestFrom(_localidade$)
            .map(([configState, localidade]) => {
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
                    localidade: localidade, 
                    tema: item.tema,
                    indicadores: indicadores.sort((a, b) => a.titulo < b.titulo ? -1 : 1)
                }
            });
        })
        // .do(console.log.bind(console, 'sent to resumo'));

        this.temas$ = panorama$
            .withLatestFrom(_localidade$)
            .map(([configState, localidade]) => {
                return configState
                    .filter(item => Boolean(item.tema))
                    .map(item => {
                        return {
                            localidade: localidade,
                            tema: item.tema,
                            painel: item.painel,
                            grafico: item.grafico.map(item => item.grafico)
                        }
                    })
            })
        // .do(console.log.bind(console, 'sent to temas'));

    }

    ngOnDestroy() {
        this._tipoLocalidade$$.unsubscribe();
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

    private _groupIndicadores({ indicadores = [] as PanoramaConfigurationItem[] }): { indicadores: Array<number>, indicadorMapPesquisa: any } {
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


    handleTemaSelecionado(tema) {
        this.temaSelecionado = tema;
    }

}