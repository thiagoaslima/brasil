import { niveisTerritoriais } from '../shared3/values';
import { Injectable } from '@angular/core';

import { ItemConfiguracao, PanoramaVisualizacao } from './configuration';
import { dadosGrafico, dadosPainel } from './configuration/panorama.values';
import { PesquisaConfiguration } from '../shared2/pesquisa/pesquisa.configuration';
import { BibliotecaService } from '../shared3/services/biblioteca.service';
import { LocalidadeService3 } from '../shared3/services/localidade.service';
import { RankingService3 } from '../shared3/services/ranking.service';
import { ConjunturaisService, ResultadoService3 } from '../shared3/services';
import { Localidade, Resultado } from '../shared3/models';
import { arrayUniqueValues, converterObjArrayEmHash } from '../utils2';
import { notasEspeciais } from '../../api/notas-demanda-legal';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class Panorama2Service {
    private _totalMunicipios: number;
    private _totalUfs: number;

    constructor(
        private _resultadoService: ResultadoService3,
        private _localidadeService: LocalidadeService3,
        private _rankingService3: RankingService3,
        private _bibliotecaService: BibliotecaService,
        private _conjunturaisService: ConjunturaisService,
        private _pesquisasConfiguration: PesquisaConfiguration
    ) {
        this._totalUfs = this._localidadeService.getRoot().children.length;
        this._totalMunicipios = this._localidadeService.getRoot().children.reduce((sum, uf) => sum + uf.children.length, 0);
    }

    getResultados(configuracao: Array<ItemConfiguracao>, localidade: Localidade) {
        const itensPesquisas: ItemConfiguracao[] = [];
        const itensConjunturais: ItemConfiguracao[] = [];
        const order: { [indicadorId: number]: number } = {};

        configuracao.forEach((item, idx) => {
            if (!item.indicadorId) { return; }

            switch (item.servico) {
                case 'conjunturais':
                    itensConjunturais.push(item);
                    break;

                default:
                    itensPesquisas.push(item);
                    break;
            }

            order[item.indicadorId] = idx;
        });

        const resPesquisas = itensPesquisas.length > 0
            ? this._resultadoService.getResultadosCompletos(itensPesquisas.map(item => item.indicadorId), localidade.codigo)
            : Observable.of([]);
        const resConjunturais = itensConjunturais.length > 0
            ? Observable.zip(...itensConjunturais.map(item => {
                return this._conjunturaisService.getIndicadorAsResultado(item.pesquisaId, item.indicadorId, item.quantidadePeriodos, item.categoria);
            })) : Observable.of([]);

        return Observable.zip(resConjunturais, resPesquisas)
            .map(([conjunturais, pesquisas]) => {
                return pesquisas
                    .concat(...conjunturais)
                    .reduce((arr, item) => {
                        const idx = order[item.indicadorId];
                        arr[idx] = item;
                        return arr;
                    }, []);
            });
    }

    getResumo(configuracao: Array<ItemConfiguracao>, localidade: Localidade) {
        if (localidade.codigo === 0) {
            return this.getResumoBrasil(configuracao, localidade);
        }
        return Observable.zip(
            this._getResultadosIndicadores(configuracao, localidade),
            localidade.tipo === 'municipio' ? this._bibliotecaService.getValues(localidade.codigo) : Observable.of({})
        ).map(([resultados, valoresBiblioteca]) => {
            return configuracao
                .filter(item => Boolean(item.indicadorId) || item.titulo === 'Gentílico')
                .map(item => {
                    const periodo = item.periodo
                        || resultados[item.indicadorId] && resultados[item.indicadorId].periodoValidoMaisRecente
                        || '-';

                    const titulo = item.titulo
                        || (
                            resultados[item.indicadorId] &&
                            resultados[item.indicadorId].indicador &&
                            resultados[item.indicadorId].indicador.nome
                        );

                    const valor = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].getValor(periodo)
                    ) || (item.titulo === 'Gentílico' ? valoresBiblioteca.GENTILICO : '-');


                    const unidade = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.unidade.toString()
                    ) || '';

                    const notas = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.notas
                    ) || [];

                    const fontes = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.fontes
                    ) || [];

                    return {
                        tema: item.tema,
                        titulo,
                        periodo,
                        valor,
                        unidade,
                        notas,
                        fontes
                    };
                });
        });
    }

    getResumoBrasil(configuracao: Array<ItemConfiguracao>, localidade: Localidade) {
        const itensPesquisas: ItemConfiguracao[] = [];
        const itensConjunturais: ItemConfiguracao[] = [];
        const order: { [indicadorId: number]: number } = {};

        configuracao.forEach((item, idx) => {
            if (!item.indicadorId) { return; }

            switch (item.servico) {
                case 'conjunturais':
                    itensConjunturais.push(item);
                    break;

                default:
                    itensPesquisas.push(item);
                    break;
            }

            order[item.titulo] = idx;
        });

        const resPesquisas = this._getResultadosIndicadores(itensPesquisas, localidade)
            .map(resultados => {
                return itensPesquisas.map(item => {
                    const periodo = item.periodo
                        || resultados[item.indicadorId] && resultados[item.indicadorId].periodoValidoMaisRecente
                        || '-';

                    const titulo = item.titulo
                        || (
                            resultados[item.indicadorId] &&
                            resultados[item.indicadorId].indicador &&
                            resultados[item.indicadorId].indicador.nome
                        );

                    const valor = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].getValor(periodo)
                    ) || '-';


                    const unidade = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.unidade.toString()
                    ) || '';

                    const notas = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.notas
                    ) || [];

                    const fontes = (
                        resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.fontes
                    ) || [];

                    return {
                        tema: item.tema,
                        titulo,
                        periodo,
                        valor,
                        unidade,
                        notas,
                        fontes
                    };
                });
            });

        const resConjunturais = Observable.zip(
            ...itensConjunturais
                .map(item => {
                    return this._conjunturaisService.getIndicador(
                        item.pesquisaId, item.indicadorId, item.quantidadePeriodos, item.categoria
                    ).take(1).map(json => {
                        const obj = json[0];

                        const periodo = item.periodo || obj.p || '-';
                        const titulo = item.titulo || obj.var;
                        const valor = obj.v || '-';
                        const unidade = obj.um === 'Percentual' ? '%' : obj.um;
                        const notas = [];
                        const fontes = [];

                        return {
                            tema: item.tema,
                            titulo,
                            periodo,
                            valor,
                            unidade,
                            notas,
                            fontes
                        };
                    });
                })
        );

        return Observable.zip(resConjunturais, resPesquisas)
            .map( ([conjunturais, pesquisas]) => {
                return pesquisas
                    .concat(...conjunturais)
                    .reduce((arr, item) => {
                        const idx = order[item.titulo];
                        arr[idx] = item;
                        return arr;
                    }, []);
            });
    }

    getTemas(configuracao: Array<ItemConfiguracao>, localidade: Localidade) {
        const resultados$ = this._getResultadosIndicadores(configuracao, localidade);

        const rankings$ = localidade.tipo === niveisTerritoriais.pais.label ?
            Observable.of({}) : this._getPosicaoRankings(configuracao, localidade);

        return Observable.zip(resultados$, rankings$)
            .map(([resultados, rankings]) => ({
                configuracao: this._organizarConfiguracaoParaTemas(configuracao, resultados, rankings),
                resultados: resultados,
                rankings: rankings
            }));
    }

    getNotaEspecial(idLocalidade, idIndicador): string {

        let notaEspecial = notasEspeciais.filter(nota => nota.localidade == idLocalidade && nota.indicador == idIndicador);

        return notaEspecial.length > 0 ? notaEspecial[0]['nota'] : '';
    }

    private _getResultadosIndicadores(
        configuracao: Array<ItemConfiguracao>,
        localidade: Localidade
    ): Observable<{ [indicadorId: number]: Resultado }> {
        let itensPesquisas: number[] = [];
        let itensConjunturais = [];

        configuracao.forEach((item, idx) => {
            switch (item.servico) {
                case 'conjunturais':
                    if (item.indicadorId) {
                        itensConjunturais.push(item);
                    }
                    if (item.grafico) {
                        item.grafico.dados.forEach(obj => {
                            itensConjunturais.push(obj);
                        });
                    }
                    break;

                default:
                if (item.indicadorId) {
                    itensPesquisas.push(item.indicadorId);
                }
                if (item.grafico) {
                    item.grafico.dados.forEach(obj => {
                        itensPesquisas.push(obj.indicadorId);
                    });
                }
                    break;
            }
        });

        itensPesquisas = arrayUniqueValues(itensPesquisas);
        itensConjunturais = converterObjArrayEmHash(itensConjunturais, 'indicadorId', true);
        itensConjunturais = Object.keys(itensConjunturais).map(key => itensConjunturais[key][0]);

        const resPesquisas = itensPesquisas.length <= 0
            ? Observable.of([])
            : this._resultadoService.getResultadosCompletos(itensPesquisas, localidade.codigo)
            .map(resultados => converterObjArrayEmHash(resultados, 'indicador.id'));

        const resConjunturais = itensConjunturais.length <= 0
            ? Observable.of([])
            : Observable.zip(...itensConjunturais.map(item => {
                return this._conjunturaisService
                    .getIndicadorAsResultado(item.pesquisaId, item.indicadorId, item.quantidadePeriodos, item.categoria)
            })).map(resultados => converterObjArrayEmHash([].concat(...resultados), 'indicador.id'));

        return Observable.zip(resPesquisas, resConjunturais)
            .map( ([pesquisas, conjunturais]) => Object.assign({}, pesquisas, conjunturais));
    }

    private _getPosicaoRankings(
        configuracao: Array<ItemConfiguracao>,
        localidade: Localidade
    ): Observable<{ [indicadorId: number]: { [contexto: string]: any } }> {
        let indicadores = configuracao
            .filter(item => item.visualizacao === PanoramaVisualizacao.painel)
            .map(item => ({ indicadorId: item.indicadorId, periodo: item.periodo }));

        if (indicadores.length === 0) {
            return Observable.of({});
        }

        let contextos = ['BR'];
        if (localidade.parent && localidade.parent.codigo) { contextos.push(localidade.parent.codigo.toString()); }
        if (localidade.microrregiao) { contextos.push(localidade.microrregiao.toString()); }

        return this._rankingService3.getRankingsIndicador(indicadores, contextos, localidade.codigo)
            .map(response => {

                return response.reduce((agg, ranking) => {
                    const id = ranking.indicadorId;

                    if (!agg[id]) {
                        agg[id] = {};
                    }

                    const _ranking = ranking && ranking.res && ranking.res[0] && ranking.res[0].ranking;

                    switch (ranking.contexto) {
                        case 'BR':
                            agg[id].BR = {
                                posicao: _ranking,
                                itens: localidade.tipo === 'municipio' ? this._totalMunicipios : this._totalUfs
                            };
                            break;

                        case localidade.parent.codigo.toString():
                            agg[id].local = { posicao: _ranking, itens: localidade.parent.children.length };
                            break;

                        case localidade.microrregiao.toString():
                            const qtde = this._localidadeService.getMunicipiosMicrorregiao(localidade.microrregiao).length;
                            agg[id].microrregiao = { posicao: _ranking, itens: qtde };
                            break;
                    }

                    return agg;
                }, {});
            });

    }

    private _organizarConfiguracaoParaTemas(
        configuracao: ItemConfiguracao[],
        resultados: { [indicadorId: number]: Resultado },
        rankings
    ): Array<{ tema: string, painel: dadosPainel[], graficos: dadosGrafico[] }> {
        const { temas } = configuracao
            .reduce(({ temas, posicao }, item) => {
                if (!item.tema) {
                    return { temas, posicao };
                }

                if (!temas[item.tema]) {
                    temas[item.tema] = {
                        idx: posicao,
                        painel: [],
                        graficos: []
                    };
                    posicao++;
                }

                if (item.visualizacao === PanoramaVisualizacao.painel) {
                    const painel = this._prepararDadosPainel(item, resultados, rankings);
                    temas[item.tema].painel.push(painel);
                }

                if (item.visualizacao === PanoramaVisualizacao.grafico) {
                    const grafico = this._prepararDadosGrafico(item, resultados);
                    temas[item.tema].graficos.push(grafico);
                }

                return { temas, posicao };
            }, { temas: {}, posicao: 0 });

        return Object.keys(temas)
            .reduce((agg, tema) => {
                let { idx, painel, graficos } = temas[tema];
                agg[idx] = { tema, painel, graficos };
                return agg;
            }, [])
            .reduce((arr, itens) => arr.concat(itens), []);
    }

    private _prepararDadosPainel(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }, rankings): dadosPainel {
        const resultado = resultados[item.indicadorId];

        return {
            mostrarLinkRanking: this._pesquisasConfiguration.isValida(item.pesquisaId),
            pesquisaId: item.pesquisaId,
            indicadorId: item.indicadorId,
            titulo: item.titulo,
            valor: resultado && resultado.valorValidoMaisRecente,
            unidade: resultado && resultado.indicador.unidade.toString(),
            ranking: rankings[item.indicadorId]
        };
    }

    private _prepararDadosGrafico(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }) {
        return {
            tipo: item.grafico.tipo,
            titulo: item.grafico.titulo,
            unidade: this.getUnidade(item, resultados),
            eixoX: this.getEixoX(item, resultados),
            dados: this.getDados(item, resultados),
            fontes: this.getFontes(item, resultados),
            link: item.grafico.link
        };
    }

    private getUnidade(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }): string[] {
        const indicadorId = item.grafico.dados[0].indicadorId;
        var res:any = resultados[indicadorId];
        if(res.indicador && res.indicador.unidade){
            return res.indicador.unidade;
        }
        return null;
    }

    private getEixoX(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }): string[] {
        const indicadorId = item.grafico.dados[0].indicadorId;
        return resultados[indicadorId].periodosValidos;
    }

    private getDados(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }) {
        return item.grafico.dados.map(item => {
            const indicadorId = item.indicadorId;
            const resultado = resultados[indicadorId];
            const valores = resultado.valoresValidos.map(valor => this.converterParaNumero(valor));
            const nome = resultado.indicador.nome;
            return { data: valores, anos: resultado.periodosValidos,  label: nome };
        });
    }

    private getFontes(item: ItemConfiguracao, resultados: { [indicadorId: number]: Resultado }): string[] {
        if (item.grafico.fontes && item.grafico.fontes.length > 0) {
            return item.grafico.fontes;
        }

        const indicadorId = item.grafico.dados[0].indicadorId;
        return resultados[indicadorId].indicador.pesquisa ?
            resultados[indicadorId].indicador.pesquisa.getAllFontes() : [];
    }

    private converterParaNumero(valor: string): number {
        if (valor === '99999999999999' || valor === '99999999999998' || valor === '99999999999997' ||
            valor === '99999999999996' || valor === '99999999999995' || valor === '99999999999992' ||
            valor === '99999999999991') {

            valor = '0';
        }
        return !!valor ? Number(valor.replace(',', '.')) : Number(valor);
    }

}
