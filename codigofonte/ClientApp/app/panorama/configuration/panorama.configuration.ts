import { PanoramaDescriptor, PanoramaItem, PanoramaConfigurationItem, PanoramaVisualizacao } from './panorama.model';
import { NiveisTerritoriais } from '../../shared2/localidade/localidade.model';
import { TiposGrafico } from '../../infografia/grafico-base/grafico.component';

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

            // --- Ambiente
            {
                pesquisaId: 10058,
                indicadorId: 60029,
                titulo: "Arborização de vias públicas",
                subtitulo: "Arborização de vias públicas",
                tema: TEMAS.meioAmbiente,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "Arborização de vias públicas",
                    tipo: TiposGrafico.barra,
                    dados: [{
                        pesquisaId: 10058,
                        indicadorId: 60029
                    }]
                }
            },

            {
                pesquisaId: 10058,
                indicadorId: 60030,
                titulo: "Esgotamento sanitário adequado",
                subtitulo: "Esgotamento sanitário adequado",
                tema: TEMAS.meioAmbiente,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "Esgotamento sanitário adequado",
                    tipo: TiposGrafico.barra,
                    dados: [{
                        pesquisaId: 10058,
                        indicadorId: 60030
                    }]
                }
            },

            {
                pesquisaId: 10058,
                indicadorId: 60031,
                titulo: "Urbanização de vias públicas",
                subtitulo: "Urbanização de vias públicas",
                tema: TEMAS.meioAmbiente,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "Urbanização de vias públicas",
                    tipo: TiposGrafico.barra,
                    dados: [{
                        pesquisaId: 10058,
                        indicadorId: 60031
                    }]
                }
            },


            // --- Educação
            {
                pesquisaId: 40,
                indicadorId: 30277,
                titulo: "IDEB",
                subtitulo: "Índice de Desenvolvimento da Educação Básica",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "IDEB",
                    tipo: TiposGrafico.linha,
                    dados: [{
                        pesquisaId: 40,
                        indicadorId: 30277
                    }]
                }
            },

            {
                pesquisaId: 10058,
                indicadorId: 60041,
                titulo: "IDEB - Anos iniciais do ensino fundamental",
                subtitulo: "Anos iniciais do ensino fundamental",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "IDEB - Anos iniciais do ensino fundamental",
                    tipo: TiposGrafico.barra,
                    dados: [{
                        pesquisaId: 10058,
                        indicadorId: 60041
                    }]
                }
            },

             {
                pesquisaId: 10058,
                indicadorId: 60042,
                titulo: "IDEB - Anos finais do ensino fundamental",
                subtitulo: "Anos finais do ensino fundamental",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "IDEB - Anos finais do ensino fundamental",
                    tipo: TiposGrafico.barra,
                    dados: [{
                        pesquisaId: 10058,
                        indicadorId: 60042
                    }]
                }
            },

            {
                pesquisaId: 13,
                indicadorId: 5908,
                titulo: "Matrículas",
                subtitulo: "no ensino fundamental",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "Matrículas",
                    tipo: TiposGrafico.coluna,
                    dados: [{
                        pesquisaId: 13,
                        indicadorId: 5903,
                    }, {
                        pesquisaId: 13,
                        indicadorId: 5908,
                    }, {
                        pesquisaId: 13,
                        indicadorId: 5913,
                    }, {
                        pesquisaId: 13,
                        indicadorId: 5918,
                    }]
                }
            },

            {
                pesquisaId: 10058,
                indicadorId: 60045,
                titulo: "Taxa de escolarização de 6 a 14 anos de idade",
                subtitulo: "6 a 14 anos de idade",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: "Taxa de escolarização de 6 a 14 anos de idade",
                    tipo: TiposGrafico.barra,
                    dados: [{
                        pesquisaId: 10058,
                        indicadorId: 60045
                    }]
                }
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
                pesquisaId: 10058,
                indicadorId: 60036,
                titulo: "População ocupada",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisaId: 10058,
                indicadorId: 60037,
                titulo: "Rendimento nominal mensal domiciliar per capita até ½ salário mínimo",
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

            {
                pesquisaId: 10058,
                indicadorId: 60032,
                titulo: "Internações por diarreia",
                tema: TEMAS.saude,
                visualizacao: PanoramaVisualizacao.painel
            },

            // {
            //     pesquisaId: 10058,
            //     indicadorId: 60033,
            //     titulo: "Mortalidade Infantil - óbitos por mil nascidos vivos",
            //     tema: TEMAS.saude,
            //     visualizacao: PanoramaVisualizacao.painel
            // },

            // --- Economia
            // {
            //     pesquisaId: 38,
            //     indicadorId: 47001,
            //     titulo: "PIB per capita",
            //     tema: TEMAS.economia,
            //     visualizacao: PanoramaVisualizacao.painel
            // },

            {
                pesquisaId: 10058,
                indicadorId: 60047,
                titulo: "PIB per capita",
                tema: TEMAS.economia,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisaId: 10058,
                indicadorId: 60048,
                titulo: "Percentual das receitas oriundas de fontes externas",
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