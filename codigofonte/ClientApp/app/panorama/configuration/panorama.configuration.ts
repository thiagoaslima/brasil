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
                    titulo: 'panorama_configuration_pais_capital',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    indicadorId: 60280,
                    pesquisaId: 10065,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_numero_municipios',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    indicadorId: 60052,
                    pesquisaId: 10059,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_area_territorial',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    indicadorId: 62887,
                    pesquisaId: 10059,
                    periodo: '2017',
                    titulo: 'panorama_configuration_pais_presidente',
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
                    titulo: 'panorama_configuration_pais_populacao_estimada',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 3145,
                    indicadorId: 93,
                    categoria: '86[0]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'panorama_configuration_pais_populacao_ultimo_censo',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico,
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60284,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_taxa_fecundidade',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_taxa_fecundidade',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60284
                        }]
                    }
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60282,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_taxa_mortalidade_infantil',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_taxa_mortalidade_infantil',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60282
                        }]
                    }
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60404,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_domicilios_com_iluminacao_eletrica',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_iluminacao_lixo_agua_esgoto',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60404
                        },
                        {
                            pesquisaId: 10065,
                            indicadorId: 60406
                        },
                        {
                            pesquisaId: 10065,
                            indicadorId: 60407
                        },
                        {
                            pesquisaId: 10065,
                            indicadorId: 60408
                        }]
                    }
                },

                {
                    pesquisaId: 10070,
                    indicadorId: 62912,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_domicilios_com_coleta_de_lixo',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10070,
                    indicadorId: 62914,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_domicilios_com_abastecimento_de_agua',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10070,
                    indicadorId: 62916,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_domicilios_com_esgotamento_sanitario',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10070,
                    indicadorId: 64508,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_domicilios_computador',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_bens_duraveis_domicilio',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 44,
                            indicadorId: 47103
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47106
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47107
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47108
                        }]
                    }
                },

                {
                    pesquisaId: 10070,
                    indicadorId: 64517,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_domicilio_acesso_internet',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_tipo_conexao_internet',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 44,
                            indicadorId: 47260
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47261
                        }]
                    }
                },

                {
                    pesquisaId: 10070,
                    indicadorId: 62921,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_posse_telefone_celular',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 10070,
                    indicadorId: 64511,
                    periodo: '2016',
                    titulo: 'panorama_configuration_pais_domicilios_televisao',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_modalidade_recepcao_sinal_tv',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 44,
                            indicadorId: 47251
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47252
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47253
                        }]
                    }
                },

                {
                    pesquisaId: 46,
                    indicadorId: 60414,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_pratica_atividade_fisica',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // ------------------------
                // EDUCAÇÃO
                // ------------------------
                {
                    pesquisaId: 10065,
                    indicadorId: 60229,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_taxa_analfabetismo_10_anos_ou_mais',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_taxa_analfabetismo_10_anos_ou_mais',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60229,
                        }]
                    }
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60232,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_taxa_escolarizacao_6_a_14_anos',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // ----------------------------
                // ECONOMIA
                // ----------------------------

                {
                    pesquisaId: 10065,
                    indicadorId: 60234,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_pib_per_capita',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_pib_per_capita',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60234
                        }]
                    }
                },

                {
                    pesquisaId: 1419,
                    indicadorId: 63,
                    categoria: '315[7169]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'panorama_configuration_pais_precos_ipca_mensal',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_ipca_inpc_ipp_acumulado_12_meses',
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
                    titulo: 'panorama_configuration_pais_precos_inpc',
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
                    titulo: 'panorama_configuration_pais_precos_ipca15',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_ipca15_acumulado_12_meses',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 1705,
                            indicadorId: 1120,
                            categoria: '315[7169]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 10
                        }]
                    }
                },

                {
                    pesquisaId: 5796,
                    indicadorId: 1396,
                    categoria: '715[33611]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'panorama_configuration_pais_preco_produtor_ipp',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 1419,
                    indicadorId: 2265,
                    categoria: '315[7169]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'panorama_configuration_pais_precos_ipca_12_meses',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 3653,
                    indicadorId: 3139,
                    categoria: '544[129314]',
                    servico: 'conjunturais',
                    quantidadePeriodos: 1,
                    titulo: 'panorama_configuration_pais_industria_pim-pf',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_pim-pf_variacao_acumulada_12_meses',
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
                    titulo: 'panorama_configuration_pais_comercio_pmc',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_pmc_variacao_acumulada_12_meses',
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
                    titulo: 'panorama_configuration_pais_servicos_pms',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_pms_variacao_acumulada_12_meses',
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
                    pesquisaId: 4094,
                    indicadorId: 4099,
                    servico: 'conjunturais',
                    categoria: '58(95253)',
                    quantidadePeriodos: 36,
                    titulo: 'panorama_configuration_pais_taxa_desocupacao_pnad_continua',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_pnad_continua_taxa_desocupacao',
                        tipo: TiposGrafico.linha,
                        link: '',
                        dados: [{
                            pesquisaId: 4094,
                            indicadorId: 4099,
                            categoria: '58(95253)',
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
                    periodo: '',
                    titulo: 'panorama_configuration_pais_pib_scnt',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_pib_taxa_acumulada_12_meses',
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
                    titulo: 'panorama_configuration_pais_construcao_sinapi',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_sinapi_construcao',
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
                    titulo: 'panorama_configuration_pais_industria_pessoal_ocupado',
                    tema: TEMAS.industria.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_industria_pessoal_ocupado',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60367,
                        }]
                    }
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60368,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_industria_producao',
                    tema: TEMAS.industria.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_pais_industria_producao_x_produtividade',
                        tipo: TiposGrafico.linha,
                        dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60368,
                        },
                        {
                            pesquisaId: 10065,
                            indicadorId: 60371,
                        }]
                    }
                },

                {
                    pesquisaId: 10065,
                    indicadorId: 60371,
                    periodo: '2015',
                    titulo: 'panorama_configuration_pais_industria_produtividade',
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
                    // pesquisaId: 48,
                    // indicadorId: 62877,
                    // periodo: '-',
                    titulo: 'panorama_configuration_estado_gentilico',
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
                    titulo: 'panorama_configuration_estado_capital',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 48,
                    indicadorId: 62876,
                    periodo: '2014',
                    titulo: 'panorama_configuration_estado_governador',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // --- População
                {
                    pesquisaId: 48,
                    indicadorId: 48985,
                    periodo: '2017',
                    titulo: 'panorama_configuration_estado_populacao_estimada',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_estado_populacao_residente_situacao_domiciliar',
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
                        titulo: 'panorama_configuration_estado_projecao_populacao',
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
                    titulo: 'panorama_configuration_estado_populacao_ultimo_censo',
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
                    titulo: 'panorama_configuration_estado_densidade_demografica',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                // --- FROTA
                {
                    pesquisaId: 22,
                    indicadorId: 28120,
                    periodo: '2016',
                    titulo: 'panorama_configuration_estado_total_veiculos',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    // pesquisaId: 22,
                    // indicadorId: 28122,
                    // periodo: '2016',
                    // titulo: 'Total de automóveis',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_estado_veiculos_tipo',
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
                    periodo: '2017',
                    titulo: 'panorama_configuration_estado_rendimento_nominal_mensal_domiciliar',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 45,
                    indicadorId: 62585,
                    periodo: '2016',
                    titulo: 'panorama_configuration_estado_pessoas_ocupadas',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 45,
                    indicadorId: 62590,
                    periodo: '2016',
                    titulo: 'panorama_configuration_estado_proporcao_pessoas_ocupadas_trabalhos_formais_semana_referencia',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 45,
                    indicadorId: 63211,
                    periodo: '2017',
                    titulo: 'panorama_configuration_estado_proporcao_pessoas_ocupadas_trabalhos_formais',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 45,
                    indicadorId: 63238,
                    periodo: '2017',
                    titulo: 'panorama_configuration_estado_rendimento_medio_trabalhos_formais',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 19,
                    indicadorId: 59935,
                    periodo: '2015',
                    titulo: 'panorama_configuration_estado_pessoal_ocupado_administracao_publica',
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
                    titulo: 'panorama_configuration_estado_matriculas_ensino_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                 {
                    pesquisaId: 13,
                    indicadorId: 5913,
                    periodo: '2015',
                    titulo: 'panorama_configuration_estado_matriculas_ensino_medio',
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
                        titulo: 'panorama_configuration_estado_matriculas',
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
                 {
                    pesquisaId: 13,
                    indicadorId: 5929,
                    periodo:'2015',
                    titulo: 'panorama_configuration_estado_docentes_ensino_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 13,
                    indicadorId: 5934,
                    periodo:'2015',
                    titulo: 'panorama_configuration_estado_docentes_ensino_medio',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 13,
                    indicadorId: 5950,
                    periodo:'2015',
                    titulo: 'panorama_configuration_estado_numero_estabelecimentos_ensino_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                 {
                    pesquisaId: 13,
                    indicadorId: 5955,
                    periodo:'2015',
                    titulo: 'panorama_configuration_estado_numero_estabelecimentos_ensino_medio',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // --- ECONOMIA
                 {
                    pesquisaId: 37,
                    indicadorId: 30255,
                    periodo: '2010',
                    titulo: 'panorama_configuration_estado_idh',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 21,
                    indicadorId: 28141,
                    titulo: 'panorama_configuration_estado_receitas_orcamentarias_realizadas',
                    periodo: '2014',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 21,
                    indicadorId: 29749,
                    titulo: 'panorama_configuration_estado_receitas_orcamentarias_empenhadas',
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

                {
                    pesquisaId: 29,
                    indicadorId: 21910,
                    periodo: '2016',
                    titulo: 'panorama_configuration_estado_numero_agencias',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 29,
                    indicadorId: 21906,
                    periodo: '2016',
                    titulo: 'panorama_configuration_estado_total_depositos',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                 // --- Ambiente
                {
                    pesquisaId: 48,
                    indicadorId: 48980,
                    periodo: '2016',
                    titulo: 'panorama_configuration_estado_area_unidade_territorial',
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
                    titulo: 'panorama_configuration_municipio_codigo',
                    tema: TEMAS.nenhum.label,
                    largura: 'half',
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    // pesquisaId: 33,
                    // indicadorId: 60409,
                    titulo: 'panorama_configuration_municipio_gentilico',
                    tema: TEMAS.nenhum.label,
                    largura: 'half',
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 33,
                    indicadorId: 29170,
                    titulo: 'panorama_configuration_municipio_prefeito',
                    tema: TEMAS.nenhum.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },


                // --- População
                {
                    pesquisaId: 33,
                    indicadorId: 29171,
                    titulo: 'panorama_configuration_municipio_populacao_estimada',
                    periodo: '2017',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_municipio_populacao_residente_religiao',
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
                    titulo: 'panorama_configuration_municipio_populacao_ultimo_censo',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 33,
                    indicadorId: 29168,
                    periodo: '2010',
                    titulo: 'panorama_configuration_municipio_densidade_demografica',
                    tema: TEMAS.populacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                // --- Ambiente
                {
                    pesquisaId: 33,
                    indicadorId: 29167,
                    periodo:'2016',
                    titulo: 'panorama_configuration_municipio_area_unidade_territorial',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60030,
                    periodo: '2010',
                    titulo: 'panorama_configuration_municipio_esgotamento_sanitario',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60029,
                    periodo: '2010',
                    titulo: 'panorama_configuration_municipio_arborizacao',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60031,
                    periodo: '2010',
                    titulo: 'panorama_configuration_municipio_urbanizacao',
                    tema: TEMAS.meioAmbiente.label,
                    visualizacao: PanoramaVisualizacao.painel
                },


                // --- Educação
                {
                    pesquisaId: 10058,
                    indicadorId: 60045,
                    periodo: '2010',
                    titulo: 'panorama_configuration_municipio_taxa_escolarizacao',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60041,
                    periodo: '2015',
                    titulo: 'panorama_configuration_municipio_ideb_anos_iniciais_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60042,
                    periodo: '2015',
                    titulo: 'panorama_configuration_municipio_ideb_anos_finais_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 13,
                    indicadorId: 5908,
                    periodo:'2015',
                    titulo: 'panorama_configuration_municipio_matriculas_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.grafico,
                    grafico: {
                        titulo: 'panorama_configuration_municipio_matriculas',
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
                    titulo: 'panorama_configuration_municipio_matriculas_medio',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 13,
                    indicadorId: 5929,
                    periodo:'2015',
                    titulo: 'panorama_configuration_municipio_docentes_ensino_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                 {
                    pesquisaId: 13,
                    indicadorId: 5934,
                    periodo:'2015',
                    titulo: 'panorama_configuration_municipio_docentes_ensino_medio',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                {
                    pesquisaId: 13,
                    indicadorId: 5950,
                    periodo:'2015',
                    titulo: 'panorama_configuration_municipio_numero_estabelecimentos_ensino_fundamental',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },
                 {
                    pesquisaId: 13,
                    indicadorId: 5955,
                    periodo:'2015',
                    titulo: 'panorama_configuration_municipio_numero_estabelecimentos_ensino_medio',
                    tema: TEMAS.educacao.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // --- Trabalho
                {
                    pesquisaId: 19,
                    indicadorId: 29765,
                    periodo: '2015',
                    titulo: 'panorama_configuration_municipio_salario_trabalhadores_formais',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 19,
                    indicadorId: 29763,
                    periodo: '2015',
                    titulo: 'panorama_configuration_municipio_pessoal_ocupado',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60036,
                    periodo: '2015',
                    titulo: 'panorama_configuration_municipio_populacao_ocupada',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60037,
                    periodo: '2010',
                    titulo: 'panorama_configuration_municipio_pencentual_pupulacao_rendimento_ate_meio_salario',
                    tema: TEMAS.trabalho.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                // --- Saúde
                {
                    pesquisaId: 39,
                    indicadorId: 30279,
                    periodo: '2014',
                    titulo: 'panorama_configuration_municipio_mortalidade_infantil',
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },
                {
                    pesquisaId: 10058,
                    indicadorId: 60032,
                    periodo: '2016',
                    titulo: 'panorama_configuration_municipio_internacoes_diarreia',
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },
                {
                    pesquisaId: 32,
                    indicadorId: 28242,
                    periodo: '2009',
                    titulo: 'panorama_configuration_municipio_estabelecimento_saude_sus',
                    tema: TEMAS.saude.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                // --- Economia
                {
                    pesquisaId: 38,
                    indicadorId: 47001,
                    periodo: '2015',
                    titulo: 'panorama_configuration_municipio_pib_per_capita',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },

                {
                    pesquisaId: 10058,
                    indicadorId: 60048,
                    periodo: '2015',
                    titulo: 'panorama_configuration_municipio_percentual_receitas_fontes_externas',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel,
                    correlacaoNegativaValorQualidade: true
                },

                // TODO: Resolver erro ao incluir este indicador.
                // {
                //     pesquisaId: 21,
                //     indicadorId: 28160,
                //     periodo: '2014',
                //     titulo: 'panorama_configuration_municipio_valor_fpm',
                //     tema: TEMAS.economia.label,
                //     visualizacao: PanoramaVisualizacao.numerico
                // },

                {
                    pesquisaId: 37,
                    indicadorId: 30255,
                    periodo: '2010',
                    titulo: 'panorama_configuration_municipio_idhm',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.numerico
                },

                {
                    pesquisaId: 21,
                    indicadorId: 28141,
                    //periodo: '2014',
                    periodo:'2008',
                    titulo: 'panorama_configuration_municipio_total_receitas_realizadas',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel
                },
                {
                    pesquisaId: 21,
                    indicadorId: 29748,
                    periodo: '2008',
                    titulo: 'panorama_configuration_municipio_total_despesas_realizadas',
                    tema: TEMAS.economia.label,
                    visualizacao: PanoramaVisualizacao.painel,
                }
            ]
        }
    };