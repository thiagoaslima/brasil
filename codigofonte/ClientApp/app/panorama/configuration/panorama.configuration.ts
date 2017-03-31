import { PanoramaDescriptor, PanoramaItem, PanoramaConfigurationItem, PanoramaVisualizacao } from './panorama.model';
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
    [NiveisTerritoriais.pais.label]: {},

    [NiveisTerritoriais.uf.label]: {},

    [NiveisTerritoriais.municipio.label]: {
        temas: [
            TEMAS.nenhum,
            TEMAS.trabalho,
            TEMAS.educacao,
            TEMAS.meioAmbiente,
            TEMAS.economia,
            TEMAS.saude,
            TEMAS.populacao
        ],

        indicadores: <PanoramaConfigurationItem[]>[
            {
                pesquisaId: 33,
                indicadorId: 29169,
                titulo: "Código do Município",
                tema: TEMAS.nenhum,
                largura: 'half',
                visualizacao: PanoramaVisualizacao.numerico
            },

            {
                pesquisaId: 33,
                indicadorId: 29170,
                titulo: "Prefeito",
                tema: TEMAS.nenhum,
                largura: 'half',
                visualizacao: PanoramaVisualizacao.numerico
            },

            // --- Educação
            {
                pesquisaId: 40,
                indicadorId: 30277,
                titulo: "IDEB",
                subtitulo: "Índice de Desenvolvimento da Educação Básica (IDEB)",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisaId: 13,
                indicadorId: 5903,
                titulo: "Matrículas no ensino pré-escolar",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisaId: 13,
                indicadorId: 5908,
                titulo: "Matrículas no ensino fundamental",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.graficoBarra
            },

            {
                pesquisaId: 13,
                indicadorId: 5913,
                titulo: "Matrículas no ensino médio",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.graficoBarra
            },

            {
                pesquisaId: 13,
                indicadorId: 5918,
                titulo: "Matrículas no ensino superior",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.graficoBarra
            },

            // --- Trabalho
            {
                pesquisaId: 19,
                indicadorId: 29765,
                titulo: "Salário médio mensal",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisaId: 19,
                indicadorId: 29763,
                titulo: "Pessoal ocupado",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisaId: 19,
                indicadorId: 29763,
                titulo: "Pessoal ocupado",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },

            // --- Saúde
            {
                pesquisaId: 39,
                indicadorId: 30279,
                titulo: "Mortalidade Infantil",
                tema: TEMAS.saude,
                visualizacao: PanoramaVisualizacao.painel
            },

            // --- Economia
            {
                pesquisaId: 38,
                indicadorId: 47001,
                titulo: "PIB per capita",
                tema: TEMAS.economia,
                visualizacao: PanoramaVisualizacao.painel
            }
            
        ] 
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