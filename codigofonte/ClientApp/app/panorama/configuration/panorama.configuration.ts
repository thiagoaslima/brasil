import { PanoramaItem, PanoramaVisualizacao } from './panorama.model';
import { NiveisTerritoriais } from '../../shared2/localidade/localidade.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/zip';

export const TEMAS = {
    nenhum: "",
    agricultura: "Agricultura",
    educacao: "Educação",
    economia: "Economia",
    frota: "Frota de veículos",
    historico: 'Histórico',
    meioAmbiente: "Meio Ambiente",
    populacao: "População",
    saude: "Saúde",
    territorio: "Território",
    trabalho: "Trabalho"
}

export const PANORAMA = {
    [NiveisTerritoriais.pais.label]: {} as {temas : string[], indicadores: PanoramaItem[]},

    [NiveisTerritoriais.uf.label]: {} as {temas : string[], indicadores: PanoramaItem[]},

    [NiveisTerritoriais.municipio.label]: {
        temas: [
            TEMAS.nenhum,
            TEMAS.trabalho,
            TEMAS.meioAmbiente,
            TEMAS.economia,
            TEMAS.saude,
            TEMAS.populacao
        ],

        indicadores: [
            {
                pesquisa: 33,
                indicador: 29169,
                titulo: "Código do Município",
                tema: TEMAS.nenhum,
                largura: 'half',
                visualizacao: PanoramaVisualizacao.numerico
            },

            {
                pesquisa: 33,
                indicador: 29170,
                titulo: "Prefeito",
                tema: TEMAS.nenhum,
                largura: 'half',
                visualizacao: PanoramaVisualizacao.numerico
            },

            // --- Educação
            {
                pesquisa: 40,
                indicador: 30277,
                titulo: "Índice de Desenvolvimento da Educação Básica (IDEB)",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisa: 13,
                indicador: 5903,
                titulo: "Matrículas no ensino pré-escolar",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisa: 13,
                indicador: 5908,
                titulo: "Matrículas no ensino fundamental",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.graficoBarra
            },

            {
                pesquisa: 13,
                indicador: 5913,
                titulo: "Matrículas no ensino médio",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.graficoBarra
            },

            {
                pesquisa: 13,
                indicador: 5918,
                titulo: "Matrículas no ensino superior",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.graficoBarra
            },

            // --- Trabalho
            {
                pesquisa: 19,
                indicador: 29765,
                titulo: "Emprego formal",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisa: 19,
                indicador: 29764,
                titulo: "Rendimento médio",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            }

        ] as PanoramaItem[]
    }
}


const processComparacao = function (indicadores, codigoLocalidade, cb) {
    return Observable.zip(
        ...indicadores.map(indicador => indicador.resultadosValidosMaisRecentes(codigoLocalidade))
    )
        .map(resultados => {
            return resultados.map(resultado => resultado['resultados'][resultado['periodos'][0]]);
        })
        .map(resultados => cb(...resultados));
}