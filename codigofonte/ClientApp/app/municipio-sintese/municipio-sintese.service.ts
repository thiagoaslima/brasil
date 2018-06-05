import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

import { converterObjArrayEmHash } from '../../utils';

import { PanoramaService } from '../panorama/panorama.service';
import { PANORAMA, ItemConfiguracao } from '../panorama/configuration';

import {
    LocalidadeService3,
    RouterParamsService,
    AppState,
    TraducaoService,
    BibliotecaService,
    ResultadoService3 } from '../shared';

/*
@Injectable()
export class EstadoSinteseService {

    private _totalMunicipios: number;
    private _totalUfs: number;
    private _localidade$$: Subscription;
    private resumo;
    private idioma;
    constructor(
        private _panoramaService: PanoramaService,
        private _localidadeService: LocalidadeService3,
        private _appState: AppState,
        private _routerParams: RouterParamsService,
        private _traducaoService: TraducaoService,
        private _bibliotecaService: BibliotecaService,
        private _resultadoService:ResultadoService3,
    ) {

    }   */



    @Injectable()
    export class MunicipioSinteseService {

    private _totalMunicipios: number;
    private _totalUfs: number;
    private _localidade$$: Subscription;
    private resumo;
    private idioma;
    constructor(
        private _panoramaService: PanoramaService,
        private _localidadeService: LocalidadeService3,
        private _appState: AppState,
        private _routerParams: RouterParamsService,
        private _traducaoService: TraducaoService,
        private _bibliotecaService: BibliotecaService,
        private _resultadoService:ResultadoService3,
    ) {

    }




    public get lang() {
        return this._traducaoService.lang;
    }



    getResumoMunicipios(estado, indicadores) {

        let municipios = estado.children;
        const resultObservables = []

        for (let municipio of municipios) {

            let configuracao = this.getConfiguracao(municipio.tipo);
            let resumoMunicipio = this._panoramaService.getResumo(configuracao, municipio)
                .map((res) => {
                    let resumo = <any>{};
                    resumo.municipio = municipio.nome;
                    res = res.map(res => {
                        if (res.titulo == 'Gentílico') {
                            resumo.gentilico = res.valor;
                        }
                        return res;
                    }).filter(res => res.titulo != 'Gentílico' && indicadores.includes(res.id + ""));

                    resumo.indicadores = res;
                    return resumo;
                });
            resultObservables.push(resumoMunicipio);
        }
        return Observable.forkJoin(resultObservables);

    }
    

    getResumoMunicipio(municipio, indicadores) {

       // debugger;


        let configuracao = this.getConfiguracao(municipio.tipo);

        return this._panoramaService.getResumo(configuracao, municipio)
            .map((res) => {

                let resumo = <any>{};
                resumo.municipio = municipio.nome;
                res = res.map(res => {
                    if (res.titulo == 'panorama_configuration_municipio_gentilico') {
                        resumo.gentilico = res.valor;
                    }
                    return res;
                }).filter(res => res.titulo != 'panorama_configuration_municipio_gentilico' && indicadores.includes(res.id + "") );

                resumo.indicadores = res;
                return resumo;
            });


    }


    getNotasResumo(resumo) {
        let notas = [];
        resumo.indicadores.filter(resultado => {

            if (resultado.notas.length === 0) {

                return false;
            }

            for (let i = 0; i < resultado.notas.length; i++) {

                if (resultado.notas[i]['periodo'] === resultado.periodo || resultado.notas[i]['periodo'] === '-') {
                    let nota = <any>{};
                    nota.descricao = resultado.notas[i]['notas'][0];
                    nota.indicador = resultado.titulo;
                    notas.push(nota);
                    return true;
                }
            }

            return false;

        });
        return notas;
    }



    getFontesResumo(resumo) {
        let fontes = [];
        resumo.indicadores.filter(resultado => {
            return !!resultado.fontes
                && resultado.fontes.length > 0
                && (
                    resultado.fontes[0]['periodo'] === resultado.periodo
                    || resultado.fontes[0]['periodo'] === '-'
                );
        }).map(resultado => {
            let fonte = <any>{};
            fonte.descricao = resultado.fontes[0]['fontes'];
            fonte.indicador = resultado.titulo;
            fontes.push(fonte);
        });
        return fontes;
    }




    getConfiguracao(tipo) {

        const { temas, indicadores } = PANORAMA[tipo] || { temas: [], indicadores: [] };
        const hash = converterObjArrayEmHash(indicadores, 'tema', true);
        return temas.reduce((agg, tema) => agg.concat(hash[tema]), [] as ItemConfiguracao[]).filter(Boolean);
    }
    getIndicadoresMunicipioCorrespondentes(indicadoresEstado) {

        let panoramaEstado = <any>PANORAMA['uf'];
        let panoramaMunicipios = PANORAMA['municipio'];
        return panoramaEstado.indicadores.
            map(indicador => panoramaMunicipios.indicadores.filter(indMun => indMun.titulo == indicador.titulo))
            .map(ind => ind[0] && ind[0].indicadorId)
            .filter(ind => ind != null)


    }


}