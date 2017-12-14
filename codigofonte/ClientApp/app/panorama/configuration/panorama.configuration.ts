import { TEMAS } from './temas.values';
import { PanoramaVisualizacao, ItemConfiguracao } from './panorama.values';

import { niveisTerritoriais } from '../../shared';
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
                TEMAS.populacao.label,
                TEMAS.economia.label,
                // TEMAS.territorio.label,
                TEMAS.educacao.label,
                // TEMAS.trabalho.label,
                // TEMAS.agropecuaria.label,
                 TEMAS.industria.label,
                 TEMAS.comercio.label,
                 TEMAS.servicos.label,
                 TEMAS.saude.label
            ],

            indicadores: [
                // ----------------------------
                // NENHUM
                // ----------------------------
                {
                    indicadorId: 60053,
                    pesquisaId: 10059,
                    periodo: '2010',
                    titulo: 'Capital',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    indicadorId: 60280,
                    pesquisaId: 10065,
                    periodo: '2016',
                    titulo: 'Número de municípios',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    indicadorId: 60272,
                    pesquisaId: 10065,
                    periodo: '2017',
                    titulo: 'Área territorial',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    indicadorId: 62887,
                    pesquisaId: 10059,
                    periodo: '2017',
                    titulo: 'Presidente',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // ------------------------
                // POPULAÇÃO
                // ------------------------
                {
                    pesquisaId: 10059,
                    indicadorId: 60056,
                    periodo: '2017',
                    titulo: 'População estimada',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 3145,
                    indicadorId: 93,
                    categoria: '86[0]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'População no último censo',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico,
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60284,
                    periodo: '2015',
                    titulo: 'Taxa de fecundidade',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60282,
                    periodo: '2015',
                    titulo: 'Taxa de mortalidade infantil',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60404,
                    periodo: '2015',
                    titulo: 'Domicílios com iluminação elétrica',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60406,
                    periodo: '2015',
                    titulo: 'Domicílios com coleta de lixo',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60407,
                    periodo: '2015',
                    titulo: 'Domicílios com rede geral de abastecimento de água',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60408,
                    periodo: '2015',
                    titulo: 'Domicílios com esgotamento sanitário adequado (Rede coletora ou fossa séptica)',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60234,
                    periodo: '2015',
                    titulo: 'PIB per capita',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // {
                //     pesquisaId: 44,
                //     indicadorId: 47108,
                //     periodo: '2015',
                //     titulo: 'Domicílios com microcomputador',
                //     tema: TEMAS.populacao.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Bens duráveis existentes no domicílio',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 44,
                //             indicadorId: 47103
                //         },
                //         {
                //             pesquisaId: 44,
                //             indicadorId: 47106
                //         },
                //         {
                //             pesquisaId: 44,
                //             indicadorId: 47107
                //         },
                //         {
                //             pesquisaId: 44,
                //             indicadorId: 47108
                //         }]
                //     }
                // },

                // {
                //     pesquisaId: 44,
                //     indicadorId: 47125,
                //     periodo: '2015',
                //     titulo: 'Domicílios com acesso à Internet',
                //     tema: TEMAS.populacao.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Tipo de conexão à Internet',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 44,
                //             indicadorId: 47260
                //         },
                //         {
                //             pesquisaId: 44,
                //             indicadorId: 47261
                //         }]
                //     }
                // },

                // {
                //     pesquisaId: 44,
                //     indicadorId: 47266,
                //     periodo: '2015',
                //     titulo: 'Posse de telefone móvel celular',
                //     tema: TEMAS.populacao.label,
                //     visualizacao: PanoramaVisualizacao.numerico
                // },

                // {
                //     pesquisaId: 44,
                //     indicadorId: 47107,
                //     periodo: '2015',
                //     titulo: 'Domicílios com televisão',
                //     tema: TEMAS.populacao.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Modalidade de recepção de sinal de televisão',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 44,
                //             indicadorId: 47251
                //         },
                //         {
                //             pesquisaId: 44,
                //             indicadorId: 47252
                //         },
                //         {
                //             pesquisaId: 44,
                //             indicadorId: 47253
                //         }]
                //     }
                // },

                // {
                //     pesquisaId: 46,
                //     indicadorId: 60414,
                //     periodo: '2015',
                //     titulo: 'Prática de atividade física',
                //     tema: TEMAS.populacao.label,
                //     visualizacao: PanoramaVisualizacao.numerico
                // },

                // ------------------------
                // EDUCAÇÃO
                // ------------------------
                {
                    pesquisaId: 10065,
                    indicadorId: 60229,
                    periodo: '2015',
                    titulo: 'Taxa de analfabetismo 10 anos ou mais de idade',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60232,
                    periodo: '2015',
                    titulo: 'Taxa de escolarização de 6 a 14 anos de idade',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // ----------------------------
                // ECONOMIA
                // ----------------------------

                {
                    pesquisaId: 1419,
                    indicadorId: 63,
                    categoria: '315[7169]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'Preços - IPCA mensal',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'IPCA x INPC x IPP - Variação acumulada em 12 meses',
                        tipo: TiposGrafico.linha,
                        link: 'https://www.ibge.gov.br/estatisticas-novoportal/economicas/precos-e-custos/9258-indice-nacional-de-precos-ao-consumidor.html',
                        dados: [{
                            pesquisaId: 1419,
                            indicadorId: 2265,
                            categoria: '315[7169]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        },
                        {
                            pesquisaId: 1100,
                            indicadorId: 2292,
                            categoria: '315[7169]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        },
                        {
                            pesquisaId: 5796,
                            indicadorId: 1394,
                            categoria: '715[33611]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                    }
                },

                {
                    pesquisaId: 1100,
                    indicadorId: 44,
                    categoria: '315[7169]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'Preços - INPC',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // {
                //     pesquisaId: 1419,
                //     indicadorId: 1120,
                //     categoria: '315[7169]',
                //     servico: 'conjunturais',
                //     quantidadePeriodos: 1,
                //     titulo: 'Preços - IPCA 12 meses',
                //     tema: TEMAS.economia.label,
                //     visualizacao: PanoramaVisualizacao.numerico
                // },

                {
                    pesquisaId: 1705,
                    indicadorId: 355,
                    categoria: '315[7169]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'Preços - IPCA15',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'IPCA15 - Variação acumulada em 12 meses',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 1705,
                            indicadorId: 1120,
                            categoria: '315[7169]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                    }
                },

                {
                    pesquisaId: 5796,
                    indicadorId: 1396,
                    categoria: '715[33611]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'Preços Produtor - IPP',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 1419,
                    indicadorId: 2265,
                    categoria: '315[7169]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'Preços - IPCA 12 meses',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 3653,
                    indicadorId: 3139,
                    categoria: '544[129314]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'Indústria - PIM-PF',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'PIM-PF - Variação acumulada em 12 meses',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 3653,
                            indicadorId: 3141,
                            categoria: '544[129314]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                    }
                },

                {
                    pesquisaId: 3416,
                    indicadorId: 564,
                    categoria: '11046[90668]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 36,
                    titulo: 'Comércio - PMC',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'PMC - Variação acumulada em 12 meses',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 3416,
                            indicadorId: 564,
                            categoria: '11046[90670]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                    }
                },

                {
                    pesquisaId: 6442,
                    indicadorId: 8677,
                    categoria: '11046[90668]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 36,
                    titulo: 'Serviços - PMS',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'PMS - Variação acumulada em 12 meses',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 6442,
                            indicadorId: 8677,
                            categoria: '11046[90670]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                    }
                },


                // Taxa de desocupação
                {
                    pesquisaId: 6381,
                    indicadorId: 4099,
                    servico: 'conjunturais',
                    categoria: '',
                    quantidadePeriodos: 36,
                    titulo: 'Taxa de desocupação - PNAD Contínua',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'PNAD Contínua - Taxa de desocupação',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 6381,
                            indicadorId: 4099,
                            categoria: '',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                    }
                },

                {
                    pesquisaId: 5932,
                    indicadorId: 6562,
                    categoria: '11255[90707]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 12,
                    periodo: '2º trimestre 2017',
                    titulo: 'PIB - SCNT',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'PIB - Taxa acumulada em 12 meses',
                        tipo: TiposGrafico.linha,
                        link: 'https://www.ibge.gov.br/estatisticas-novoportal/economicas/contas-nacionais/2036-np-produto-interno-bruto-dos-municipios/9088-produto-interno-bruto-dos-municipios.html',
                        dados: [{
                            pesquisaId: 5932,
                            indicadorId: 6562,
                            categoria: '11255[90707]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36,
                        }]
                    }
                },




                // SINAPI
                {
                    pesquisaId: 2296,
                    indicadorId: 1196,
                    categoria: '',
                    servico: 'conjunturais',
                    quantidadePeriodos: 36,
                    titulo: 'Construção - SINAPI',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'SINAPI - Construção',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 2296,
                            indicadorId: 1196,
                            categoria: '',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                    }
                },
            


                // ----------------------------
                // TERRITORIO
                // ----------------------------



                // ----------------------------
                // INDÚSTRIA
                // ----------------------------
                {
                    pesquisaId: 10065,
                    indicadorId: 60367,
                    periodo: '2015',
                    titulo: 'Pessoal ocupado assalariado - Índice acumulado em relação ao mesmo período do ano anterior',
                    tema: TEMAS.industria.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60368,
                    periodo: '2015',
                    titulo: 'Produção industrial - Índice acumulado em relação ao mesmo período do ano anterior',
                    tema: TEMAS.industria.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60371,
                    periodo: '2015',
                    titulo: 'Produtividade - Índice acumulado em relação ao mesmo período do ano anterior',
                    tema: TEMAS.industria.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },


                // ----------------------------
                // COMÉRCIO
                // ----------------------------
                // {
                //     indicadorId: 49243,
                //     pesquisaId: 50,
                //     periodo: '2015',
                //     titulo: 'Número de unidades locais com receita de revenda',
                //     tema: TEMAS.comercio.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Número de unidades locais com receita de revenda',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 50,
                //             indicadorId: 49243
                //         }]
                //     }
                // },
                // {
                //     indicadorId: 49244,
                //     pesquisaId: 50,
                //     periodo: '2015',
                //     titulo: 'Pessoal ocupado em 31/12 em empresas comerciais',
                //     tema: TEMAS.comercio.label,
                //     visualizacao: PanoramaVisualizacao.numerico
                // },


                // ----------------------------
                // SERVIÇOS
                // ----------------------------
                // {
                //     indicadorId: 49641,
                //     pesquisaId: 52,
                //     periodo: '2014',
                //     titulo: 'Número de empresas',
                //     tema: TEMAS.servicos.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Número de empresas',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 52,
                //             indicadorId: 49641
                //         }]
                //     }
                // },
                // {
                //     indicadorId: 49642,
                //     pesquisaId: 52,
                //     periodo: '2014',
                //     titulo: 'Pessoal ocupado em 31/12',
                //     tema: TEMAS.servicos.label,
                //     visualizacao: PanoramaVisualizacao.numerico
                // },



                // ----------------------------
                // SAÚDE
                // ----------------------------
                // {
                //     pesquisaId: 10054,
                //     indicadorId: 59647,
                //     periodo: '2016',
                //     titulo: 'Esperança de vida ao nascer',
                //     tema: TEMAS.saude.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Esperança de vida ao nascer',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 10054,
                //             indicadorId: 59647
                //         }]
                //     }
                // },

                // {
                //     indicadorId: 30279,
                //     pesquisaId: 39,
                //     periodo: '2014',
                //     titulo: 'Taxa de mortalidade infantil',
                //     tema: TEMAS.saude.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Taxa de mortalidade infantil',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 39,
                //             indicadorId: 30279
                //         }]
                //     }
                // },

                // {
                //     pesquisaId: 10055,
                //     indicadorId: 59745,
                //     periodo: '2014',
                //     titulo: 'Taxa de fecundidade total',
                //     tema: TEMAS.saude.label,
                //     visualizacao: PanoramaVisualizacao.grafico,
                //     grafico: {
                //         titulo: 'Taxa de fecundidade total',
                //         tipo: TiposGrafico.linha,
                //         dados: [{
                //             pesquisaId: 10055,
                //             indicadorId: 59745
                //         }]
                //     }
                // }

            ]
        },


        // ----------------------------
        // UF
        // ----------------------------

        [niveisTerritoriais.uf.label]: {
            temas: [
                TEMAS.nenhum.label,
                TEMAS.populacao.label,
                TEMAS.educacao.label,
                TEMAS.trabalho.label,
                TEMAS.frota.label,
                TEMAS.economia.label,
                TEMAS.saude.label,
                TEMAS.meioAmbiente.label
            ],
            indicadores: [
                // {
                //     pesquisaId: 48,
                //     indicadorId: 0,
                //     titulo: 'Código do Estado',
                //     tema: TEMAS.nenhum.label,
                //     largura: 'half',
                //     visualizacao: PanoramaVisualizacao.numerico
                // },
                {
                    pesquisaId: 48,
                    indicadorId: 62877,
                    periodo: '-',
                    titulo: 'Gentílico',
                    tema: TEMAS.nenhum.label,
                    largura: 'half',
                    visualizacao: PanoramaVisualizacao.numerico
                },
                // {
                //     pesquisaId: 48,
                //     indicadorId: 0,
                //     titulo: 'Número de municípios',
                //     tema: TEMAS.nenhum.label,
                //     visualizacao: PanoramaVisualizacao.numerico
                // },
                {
                    pesquisaId: 48,
                    indicadorId: 48981,
                    periodo: '2010',
                    titulo: 'Capital',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 48,
                    indicadorId: 62876,
                    periodo: '2014',
                    titulo: 'Governador',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // --- População
                {
                    pesquisaId: 48,
                    indicadorId: 48985,
                    periodo: '2017',
                    titulo: 'População estimada',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'População residente por situação domiciliar (urbana/rural)',
                        tipo: TiposGrafico.coluna,
                        dados: [{
                            pesquisaId: 23,
                            indicadorId: 25191
                        }, {
                            pesquisaId: 23,
                            indicadorId: 25199
                        }]
                    }
                },

                {

                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'Projeção da População',
                        link: "https://www.ibge.gov.br/estatisticas-novoportal/sociais/populacao/9103-estimativas-de-populacao.html",
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 53,
                            indicadorId: 49645
                        }]
                    }
                },

                {
                    pesquisaId: 23,
                    indicadorId: 25207,
                    periodo: '2010',
                    titulo: 'População no último censo',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                    // grafico: {
                    //     titulo: 'População residente por grupos de idade',
                    //     tipo: TiposGrafico.coluna,
                    //     dados: [{
                    //         pesquisaId: 23,
                    //         indicadorId: 25181
                    //     }, {
                    //         pesquisaId: 23,
                    //         indicadorId: 25182
                    //     }, {
                    //         pesquisaId: 23,
                    //         indicadorId: 25183
                    //     }, {
                    //         pesquisaId: 23,
                    //         indicadorId: 25184
                    //     }, {
                    //         pesquisaId: 23,
                    //         indicadorId: 25185
                    //     }, {
                    //         pesquisaId: 23,
                    //         indicadorId: 25186
                    //     }]
                    // }
                },
                {
                    pesquisaId: 48,
                    indicadorId: 48982,
                    periodo: '2010',
                    titulo: 'Densidade demográfica',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                // {
                //     pesquisaId: 20,
                //     indicadorId: 29788,
                //     periodo: '2015',
                //     titulo: 'Óbitos ocorridos no estado',
                //     tema: TEMAS.populacao.label,
                //     visualizacao: PanoramaVisualizacao.painel
                // },

                // --- Trabalho
                {
                    pesquisaId: 48,
                    indicadorId: 48986,
                    periodo: '2016',
                    titulo: 'Rendimento nominal mensal domiciliar per capita',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 45,
                    indicadorId: 62585,
                    periodo: '2016',
                    titulo: 'Pessoas de 16 anos ou mais ocupadas na semana de referência',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 45,
                    indicadorId: 62590,
                    periodo: '2016',
                    titulo: 'Proporção de pessoas de 16 anos ou mais em trabalho formal, considerando apenas as ocupadas na semana de referência',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 19,
                    indicadorId: 59935,
                    periodo: '2015',
                    titulo: 'Pessoal ocupado na Administração pública, defesa e seguridade social',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                // --- EDUCAÇÃO
                // {
                //     pesquisaId: 40,
                //     indicadorId: 30277,
                //     periodo: '2015',
                //     titulo: 'IDEB – Anos iniciais do ensino fundamental',
                //     tema: TEMAS.educacao.label,
                //     visualizacao: PanoramaVisualizacao.painel
                // },
                 {
                    pesquisaId: 13,
                    indicadorId: 5908,
                    periodo: '2015',
                    titulo: 'Matrículas no ensino fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    // pesquisaId: 13,
                    // indicadorId: 5908,
                    periodo: '2015',
                    // titulo: 'Matrículas no ensino fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'Matrículas',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 13,
                            indicadorId: 5903,
                        }, {
                            pesquisaId: 13,
                            indicadorId: 5908,
                        }, {
                            pesquisaId: 13,
                            indicadorId: 5913,
                        }]
                    }
                },

                // --- FROTA
                {
                    pesquisaId: 22,
                    indicadorId: 28120,
                    periodo: '2016',
                    titulo: 'Total de veículos',
                    tema: TEMAS.frota.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    // pesquisaId: 22,
                    // indicadorId: 28122,
                    // periodo: '2016',
                    // titulo: 'Total de automóveis',
                    tema: TEMAS.frota.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'Veículos por tipo',
                        tipo: TiposGrafico.coluna,
                        dados: [
                            {
                                pesquisaId: 22,
                                indicadorId: 28122
                            },
                            {
                                pesquisaId: 22,
                                indicadorId: 28123
                            },
                            {
                                pesquisaId: 22,
                                indicadorId: 28130
                            },
                            {
                                pesquisaId: 22,
                                indicadorId: 28128
                            }
                        ]
                    }
                },

                // --- ECONOMIA
                 {
                    pesquisaId: 37,
                    indicadorId: 30255,
                    periodo: '2010',
                    titulo: 'Índice de Desenvolvimento Humano (IDH)',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 21,
                    indicadorId: 28141,
                    titulo: 'Receitas orçamentárias realizadas',
                    periodo: '2014',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 21,
                    indicadorId: 29749,
                    titulo: 'Despesas orçamentárias empenhadas',
                    periodo: '2014',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    // grafico: {
                    //     titulo: 'Despesas orçamentárias por natureza',
                    //     tipo: TiposGrafico.coluna,
                    //     dados: [
                    //         {
                    //             pesquisaId: 21,
                    //             indicadorId: 28136
                    //         },
                    //         {
                    //             pesquisaId: 21,
                    //             indicadorId: 28137
                    //         },
                    //         {
                    //             pesquisaId: 21,
                    //             indicadorId: 28138
                    //         },
                    //         {
                    //             pesquisaId: 21,
                    //             indicadorId: 28140
                    //         }
                    //     ]
                    // }
                },

                 // --- Ambiente
                {
                    pesquisaId: 48,
                    indicadorId: 48980,
                    periodo: '2016',
                    titulo: 'Área da unidade territorial',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                }
                // {
                //     pesquisaId: 10058,
                //     indicadorId: 60030,
                //     periodo: '2010',
                //     titulo: 'Esgotamento sanitário adequado',
                //     tema: TEMAS.meioAmbiente.label,
                //     visualizacao: PanoramaVisualizacao.painel
                // },
                // {
                //     pesquisaId: 10058,
                //     indicadorId: 60029,
                //     periodo: '2010',
                //     titulo: 'Arborização de vias públicas',
                //     tema: TEMAS.meioAmbiente.label,
                //     visualizacao: PanoramaVisualizacao.painel
                // },
                // {
                //     pesquisaId: 10058,
                //     indicadorId: 60031,
                //     periodo: '2010',
                //     titulo: 'Urbanização de vias públicas',
                //     tema: TEMAS.meioAmbiente.label,
                //     visualizacao: PanoramaVisualizacao.painel
                // },
            ]
        },

        // ------------------------------------
        // MUNICIPIO
        // ------------------------------------

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
                    titulo: 'Código do Município',
                    tema: TEMAS.nenhum.label,
                    largura: 'half',
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    // pesquisaId: 33,
                    // indicadorId: 60409,
                    titulo: 'Gentílico',
                    tema: TEMAS.nenhum.label,
                    largura: 'half',
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 33,
                    indicadorId: 29170,
                    titulo: 'Prefeito',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },


                // --- População
                {
                    pesquisaId: 33,
                    indicadorId: 29171,
                    titulo: 'População estimada',
                    periodo: '2017',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'População residente por religião',
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
                    pesquisaId: 23,
                    indicadorId: 25207,
                    periodo: '2010',
                    titulo: 'População no último censo',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 33,
                    indicadorId: 29168,
                    periodo: '2010',
                    titulo: 'Densidade demográfica',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },



                // --- Ambiente
                {
                    pesquisaId: 33,
                    indicadorId: 29167,
                    periodo:'2016',
                    titulo: 'Área da unidade territorial',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60030,
                    periodo: '2010',
                    titulo: 'Esgotamento sanitário adequado',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60029,
                    periodo: '2010',
                    titulo: 'Arborização de vias públicas',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60031,
                    periodo: '2010',
                    titulo: 'Urbanização de vias públicas',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },


                // --- Educação
                {
                    pesquisaId: 10058,
                    indicadorId: 60045,
                    periodo: '2010',
                    titulo: 'Taxa de escolarização de 6 a 14 anos de idade',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60041,
                    periodo: '2015',
                    titulo: 'IDEB – Anos iniciais do ensino fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60042,
                    periodo: '2015',
                    titulo: 'IDEB – Anos finais do ensino fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 13,
                    indicadorId: 5908,
                    periodo:'2015',
                    titulo: 'Matrículas no ensino fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'Matrículas',
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
                    pesquisaId: 13,
                    indicadorId: 5913,
                    periodo:'2015',
                    titulo: 'Matrículas no ensino médio',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },


                // --- Trabalho
                {
                    pesquisaId: 19,
                    indicadorId: 29765,
                    periodo: '2015',
                    titulo: 'Salário médio mensal dos trabalhadores formais',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 19,
                    indicadorId: 29763,
                    periodo: '2015',
                    titulo: 'Pessoal ocupado',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60036,
                    periodo: '2015',
                    titulo: 'População ocupada',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60037,
                    periodo: '2010',
                    titulo: 'Percentual da população com rendimento nominal mensal per capita de até 1/2 salário mínimo',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                // --- Saúde
                {
                    pesquisaId: 39,
                    indicadorId: 30279,
                    periodo: '2014',
                    titulo: 'Mortalidade Infantil',
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60032,
                    periodo: '2016',
                    titulo: 'Internações por diarreia',
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },
                {
                    pesquisaId: 32,
                    indicadorId: 28242,
                    periodo: '2009',
                    titulo: 'Estabelecimentos de Saúde SUS',
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // --- Economia
                {
                    pesquisaId: 10058,
                    indicadorId: 60047,
                    periodo: '2014',
                    titulo: 'PIB per capita',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 10058,
                    indicadorId: 60048,
                    periodo: '2015',
                    titulo: 'Percentual das receitas oriundas de fontes externas',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },

                {
                    pesquisaId: 37,
                    indicadorId: 30255,
                    periodo: '2010',
                    titulo: 'Índice de Desenvolvimento Humano Municipal (IDHM)',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                }

            ]
        }
    };
