import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Panorama2Service } from '../panorama2/panorama.service';
import { LocalidadeService2 } from '../shared2/localidade/localidade.service';
import { RouterParamsService } from '../shared/router-params.service';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../shared2/app-state';
import { converterObjArrayEmHash } from '../utils2';
import { PANORAMA, ItemConfiguracao } from '../panorama2/configuration';
import { TraducaoService } from '../traducao/traducao.service';
import { BibliotecaService } from '../shared3/services/biblioteca.service';
import { ResultadoService3 } from '../shared3/services/resultado.service';

@Injectable()
export class EstadoSinteseService {

    private _totalMunicipios: number;
    private _totalUfs: number;
    private _localidade$$: Subscription;
    private resumo;
    private idioma;
    constructor(
        private _panoramaService: Panorama2Service,
        private _localidadeService: LocalidadeService2,
        private _appState: AppState,
        private _routerParams: RouterParamsService,
        private _traducaoService: TraducaoService,
        private _bibliotecaService: BibliotecaService,
        private _resultadoService: ResultadoService3
    ) {

        this.idioma = this._traducaoService.lang;

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
    getResumoEstado(localidade, indicadores) {

        let configuracao = this.getConfiguracao('municipio');
        let resumo = <any>{};
        resumo.municipios = <any>[];
        for (let municipio of localidade.children) {


            resumo.municipios.push({ codigo: municipio.codigo, nome: municipio.nome });

        }

        return Observable.zip(
            this._resultadoService.getResultadosCompletosSubLocalidade(indicadores, localidade.codigo).map(resultados => converterObjArrayEmHash(resultados, 'codigoLocalidade', true)),
            this._bibliotecaService.getValuesEstado(localidade.codigo)
        )
            .map(([resultados, valoresBiblioteca]) => {

                resumo.municipios.map(municipio => {

                    municipio.indicadores = resultados[municipio.codigo].map(resultado => {

                        let codigoLocalidade = Object.keys(valoresBiblioteca).filter(valor => valor.substring(0, 6) == resultado.codigoLocalidade + "").shift();
                        let valorBiblioteca = valoresBiblioteca[codigoLocalidade];
                        let configuracao = this.getConfiguracao('municipio');
                        return configuracao
                            .filter(item => Boolean(item.indicadorId) && resultado.indicador.id == item.indicadorId)
                            .map(item => {

                                municipio.gentilico = valorBiblioteca.GENTILICO;
                                const periodo = item.periodo
                                    || resultado && resultado.periodoValidoMaisRecente
                                    || '-';

                                const titulo = item.titulo
                                    || (
                                        resultado &&
                                        resultado.indicador &&
                                        resultado.indicador.nome
                                    );

                                const valor = (
                                    resultado &&
                                    resultado.valorMaisRecente
                                )


                                const unidade = (
                                    resultado &&
                                    resultado.indicador &&
                                    resultado.indicador.unidade.toString()
                                ) || '';

                                const notas = (
                                    resultado &&
                                    resultado.indicador &&
                                    resultado.indicador.notas
                                ) || [];

                                const fontes = (
                                    resultado &&
                                    resultado.indicador &&
                                    resultado.indicador.fontes
                                ) || [];


                                return {
                                    tema: item.tema,
                                    titulo,
                                    periodo,
                                    valor,
                                    unidade,
                                    notas,
                                    fontes,
                                    id: item.indicadorId
                                };
                            }).shift();

                    })
                    return municipio;



                })
                return resumo;

            })


    }
    getIndicadores(estado) {

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
