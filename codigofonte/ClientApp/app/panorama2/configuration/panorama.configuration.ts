import { TEMAS } from './temas.values';
import { PanoramaVisualizacao, ItemConfiguracao } from './panorama.values';

import { niveisTerritoriais } from '../../shared3/values';
import { TiposGrafico } from '../../infografia/grafico-base/grafico.values';


export const PANORAMA: {
    [label: string]: {
        temas: string[],
        indicadores: ItemConfiguracao[]
    }
} = {
        [niveisTerritoriais.pais.label]: {
            temas: [
                TEMAS.nenhum.label,
                TEMAS.territorio.label,
                TEMAS.populacao.label,
                TEMAS.educacao.label,
                TEMAS.trabalho.label,
                TEMAS.agropecuaria.label,
                TEMAS.industria.label,
                TEMAS.comercio.label,
                TEMAS.servicos.label,
                TEMAS.economia.label
            ],

            indicadores: [
                {
                    indicadorId: 60272,
                    pesquisaId: 10065,
                    periodo: "2017",
                    titulo: "Área territorial",
                    tema: TEMAS.territorio.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: "Área por bioma",
                        tipo: TiposGrafico.coluna,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60273,
                        }, {
                            pesquisaId: 10065,
                            indicadorId: 60274,
                        }, {
                            pesquisaId: 10065,
                            indicadorId: 60275,
                        }, {
                            pesquisaId: 10065,
                            indicadorId: 60276,
                        }, {
                            pesquisaId: 10065,
                            indicadorId: 60277,
                        }, {
                            pesquisaId: 10065,
                            indicadorId: 60278,
                        }]
                    }
                },

                {
                    indicadorId: 60272,
                    pesquisaId: 10065,
                    periodo: "2017",
                    titulo: "Número de municípios",
                    tema: TEMAS.territorio.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },


                {
                    indicadorId: 60410,
                    pesquisaId: 10065,
                    periodo: "2010",
                    titulo: "Total de habitantes",
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: "Total de habitantes",
                        tipo: TiposGrafico.coluna,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60410,
                        }]
                    }
                }
            ]
        },

        // [NiveisTerritoriais.uf.label]: {},

        [niveisTerritoriais.municipio.label]: {
            temas: [
                TEMAS.nenhum.label,
                TEMAS.populacao.label,
                TEMAS.trabalho.label,
                TEMAS.educacao.label,
                TEMAS.economia.label,
                TEMAS.saude.label,
                TEMAS.meioAmbiente.label
            ],

            indicadores: [
                {
                    pesquisaId: 33,
                    indicadorId: 29169,
                    titulo: "Código do Município",
                    tema: TEMAS.nenhum.label,
                    largura: 'half',
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 33,
                    indicadorId: 60409,
                    titulo: "Gentílico",
                    tema: TEMAS.nenhum.label,
                    largura: 'half',
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 33,
                    indicadorId: 29170,
                    titulo: "Prefeito",
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },


                // --- População
                {
                    pesquisaId: 33,
                    indicadorId: 29171,
                    titulo: "População estimada",
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: "População residente por religião",
                        tipo: TiposGrafico.coluna,
                        dados: [{
                            pesquisaId: 23,
                            indicadorId: 22423
                        }, {
                            pesquisaId: 23,
                            indicadorId: 22426
                        }, {
                            pesquisaId: 23,
                            indicadorId: 22424
                        }]
                    }
                },

                {
                    pesquisaId: 33,
                    indicadorId: 29166,
                    periodo: "2010",
                    titulo: "População no último censo",
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 33,
                    indicadorId: 29168,
                    periodo: "2010",
                    titulo: "Densidade demográfica",
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },



                // --- Ambiente
                {
                    pesquisaId: 33,
                    indicadorId: 29167,
                    titulo: "Área da unidade territorial",
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60030,
                    periodo: "2010",
                    titulo: "Esgotamento sanitário adequado",
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60029,
                    periodo: "2010",
                    titulo: "Arborização de vias públicas",
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60031,
                    periodo: "2010",
                    titulo: "Urbanização de vias públicas",
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },


                // --- Educação
                {
                    pesquisaId: 10058,
                    indicadorId: 60045,
                    periodo: "2010",
                    titulo: "Taxa de escolarização de 6 a 14 anos de idade",
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60041,
                    periodo: "2015",
                    titulo: "IDEB – Anos iniciais do ensino fundamental",
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60042,
                    periodo: "2015",
                    titulo: "IDEB – Anos finais do ensino fundamental",
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 13,
                    indicadorId: 5908,
                    titulo: "Matrículas no ensino fundamental",
                    tema: TEMAS.educacao.label,
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


                // --- Trabalho
                {
                    pesquisaId: 19,
                    indicadorId: 29765,
                    periodo: "2014",
                    titulo: "Salário médio mensal dos trabalhadores formais",
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 19,
                    indicadorId: 29763,
                    periodo: "2014",
                    titulo: "Pessoal ocupado",
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60036,
                    periodo: "2014",
                    titulo: "População ocupada",
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60037,
                    periodo: "2010",
                    titulo: "Percentual da população com rendimento nominal mensal per capita de até 1/2 salário mínimo",
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                // --- Saúde
                {
                    pesquisaId: 39,
                    indicadorId: 30279,
                    periodo: "2014",
                    titulo: "Mortalidade Infantil",
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60032,
                    periodo: "2016",
                    titulo: "Internações por diarreia",
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },
                {
                    pesquisaId: 32,
                    indicadorId: 28242,
                    titulo: "Estabelecimentos de Saúde SUS",
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // --- Economia
                {
                    pesquisaId: 10058,
                    indicadorId: 60047,
                    periodo: "2014",
                    titulo: "PIB per capita",
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 10058,
                    indicadorId: 60048,
                    periodo: "2015",
                    titulo: "Percentual das receitas oriundas de fontes externas",
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },

                {
                    pesquisaId: 37,
                    indicadorId: 30255,
                    titulo: "Índice de Desenvolvimento Humano Municipal (IDHM)",
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                }

            ]
        }
    }