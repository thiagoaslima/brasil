import { PanoramaDescriptor, PanoramaItem, PanoramaConfigurationItem, PanoramaVisualizacao } from './panorama.model';
import { NiveisTerritoriais } from '../../shared2/localidade/localidade.model';
import { TiposGrafico } from '../../infografia/grafico-base/grafico.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/zip';

export const TEMAS = {
    nenhum: "",
    agricultura: "Agricultura",
    agropecuaria: "Agropecuária",
    comercio: "Comércio",
    educacao: "Educação",
    economia: "Economia",
    frota: "Frota de veículos",
    historico: 'Histórico',
    industria: "Indústria",
    meioAmbiente: "Território e Ambiente",
    populacao: "População",
    saude: "Saúde",
    servicos: "Serviços",
    territorio: "Território",
    trabalho: "Trabalho e Rendimento"
}

export const PANORAMA = {
    [NiveisTerritoriais.pais.label]: {
        temas: [
            TEMAS.nenhum,
            TEMAS.territorio,
            TEMAS.populacao,
            TEMAS.educacao,
            TEMAS.trabalho,
            TEMAS.agropecuaria,
            TEMAS.industria,
            TEMAS.comercio,
            TEMAS.servicos,
            TEMAS.economia
        ],

        indicadores: [
            {
                indicadorId: 60272,
                pesquisaId: 10065,
                periodo: "2017",
                titulo: "Área territorial",
                tema: TEMAS.territorio,
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
                tema: TEMAS.territorio,
                visualizacao: PanoramaVisualizacao.numerico
            },


            {
                indicadorId: 60410,
                pesquisaId: 10065,
                periodo: "2010",
                titulo: "Total de habitantes",
                tema: TEMAS.populacao,
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
        ] as PanoramaConfigurationItem[]
    },

    [NiveisTerritoriais.uf.label]: {},

    [NiveisTerritoriais.municipio.label]: {
        temas: [
            TEMAS.nenhum,
            TEMAS.populacao,
            TEMAS.trabalho,
            TEMAS.educacao,
            TEMAS.economia,
            TEMAS.saude,
            TEMAS.meioAmbiente
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


            // --- População
            // {
            //     pesquisaId: 33,
            //     indicadorId: 60409,
            //     titulo: " Gentílico",
            //     tema: TEMAS.populacao,
            //     visualizacao: PanoramaVisualizacao.numerico
            // },
            {
                pesquisaId: 23,
                indicadorId: 22423,
                titulo: "População residente, religião católica apostólica romana",
                subtitulo: "População residente, religião católica apostólica romana",
                tema: TEMAS.populacao,
                visualizacao: PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 23,
                indicadorId: 22424,
                titulo: "População residente, religião espírita",
                subtitulo: "População residente, religião espírita",
                tema: TEMAS.populacao,
                visualizacao: PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 23,
                indicadorId: 22426,
                titulo: "População residente, religião evangélicas",
                subtitulo: "População residente, religião evangélicas",
                tema: TEMAS.populacao,
                visualizacao: PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 29171,
                titulo: "População estimada",
                subtitulo: "População estimada",
                tema: TEMAS.populacao,
                visualizacao: PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 29166,
                periodo: "2010",
                titulo: "População no último censo",
                subtitulo: "População no último censo",
                tema: TEMAS.populacao,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 33,
                indicadorId: 29168,
                periodo: "2010",
                titulo: "Densidade demográfica",
                subtitulo: "Densidade demográfica",
                tema: TEMAS.populacao,
                visualizacao: PanoramaVisualizacao.painel
            },



            // --- Ambiente
            {
                pesquisaId: 33,
                indicadorId: 29167,
                titulo: "Área da unidade territorial",
                subtitulo: "Área da unidade territorial",
                tema: TEMAS.meioAmbiente,
                visualizacao: PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10058,
                indicadorId: 60030,
                periodo: "2010",
                titulo: "Esgotamento sanitário adequado",
                subtitulo: "Esgotamento sanitário adequado",
                tema: TEMAS.meioAmbiente,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60029,
                periodo: "2010",
                titulo: "Arborização de vias públicas",
                subtitulo: "Arborização de vias públicas",
                tema: TEMAS.meioAmbiente,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60031,
                periodo: "2010",
                titulo: "Urbanização de vias públicas",
                subtitulo: "Urbanização de vias públicas",
                tema: TEMAS.meioAmbiente,
                visualizacao: PanoramaVisualizacao.painel
            },


            // --- Educação
            {
                pesquisaId: 40,
                indicadorId: 30277,
                periodo: "2013",
                titulo: "IDEB",
                subtitulo: "Índice de Desenvolvimento da Educação Básica",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel,

            },
            {
                pesquisaId: 10058,
                indicadorId: 60045,
                periodo: "2010",
                titulo: "Taxa de escolarização de 6 a 14 anos de idade",
                subtitulo: "6 a 14 anos de idade",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60041,
                periodo: "2015",
                titulo: "IDEB - Anos  iniciais do ensino fundamental",
                subtitulo: "Anos iniciais e finais do ensino fundamental",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60042,
                periodo: "2015",
                titulo: "IDEB - Anos finais do ensino fundamental",
                subtitulo: "Anos finais do ensino fundamental",
                tema: TEMAS.educacao,
                visualizacao: PanoramaVisualizacao.painel
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


            // --- Trabalho
            {
                pesquisaId: 19,
                indicadorId: 29765,
                periodo: "2014",
                titulo: "Salário médio mensal dos trabalhadores formais",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 19,
                indicadorId: 29763,
                periodo: "2014",
                titulo: "Pessoal ocupado",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60036,
                periodo: "2014",
                titulo: "População ocupada",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60037,
                periodo: "2010",
                titulo: "Percentual da população com rendimento nominal mensal per capita de até 1/2 salário mínimo",
                tema: TEMAS.trabalho,
                visualizacao: PanoramaVisualizacao.painel
            },

            // --- Saúde
            {
                pesquisaId: 39,
                indicadorId: 30279,
                periodo: "2014",
                titulo: "Mortalidade Infantil",
                tema: TEMAS.saude,
                visualizacao: PanoramaVisualizacao.painel,
                maiorMelhor: false
            },
            {
                pesquisaId: 10058,
                indicadorId: 60032,
                periodo: "2016",
                titulo: "Internações por diarreia",
                tema: TEMAS.saude,
                visualizacao: PanoramaVisualizacao.painel,
                maiorMelhor: false
            },
            {
                pesquisaId: 32,
                indicadorId: 28242,
                titulo: "Estabelecimentos de Saúde SUS",
                tema: TEMAS.saude,
                visualizacao: PanoramaVisualizacao.numerico
            },

            // --- Economia
            {
                pesquisaId: 10058,
                indicadorId: 60047,
                periodo: "2014",
                titulo: "PIB per capita",
                tema: TEMAS.economia,
                visualizacao: PanoramaVisualizacao.painel
            },

            {
                pesquisaId: 10058,
                indicadorId: 60048,
                periodo: "2015",
                titulo: "Percentual das receitas oriundas de fontes externas",
                tema: TEMAS.economia,
                visualizacao: PanoramaVisualizacao.painel,
                maiorMelhor: false
            },

            {
                pesquisaId: 37,
                indicadorId: 30255,
                titulo: "Índice de Desenvolvimento Humano Municipal",
                tema: TEMAS.economia,
                visualizacao: PanoramaVisualizacao.numerico
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