import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/zip';

export const TEMAS = {
    nenhum: "",
    historico: 'Histórico',
    territorio: "Território",
    populacao: "População",
    economia: "Economia",
    frota: "Frota de veículos",
    educacao: "Educação",
    saude: "Saúde"
}

export class PANORAMA {
    temas = [
        TEMAS.nenhum,
        TEMAS.historico,
        TEMAS.territorio,
        TEMAS.populacao,
        TEMAS.economia,
        TEMAS.frota,
        TEMAS.educacao,
        TEMAS.saude
    ]

    pais = []

    uf = []

    municipio = <PanoramaItem[]>[
        {
            pesquisa: 33,
            indicador: 29169,
            titulo: "Código do Município",
            tema: TEMAS.nenhum,
            largura: 'half'
        },

        {
            pesquisa: 33,
            indicador: 29170,
            titulo: "Prefeito",
            tema: TEMAS.nenhum,
            largura: 'half'
        },

        {
            titulo: "Histórico",
            tema: TEMAS.historico,
            link: 'historico'
        },

        // --- Território

        {
            pesquisa: 33,
            indicador: 29167,
            titulo: "Área Territorial",
            tema: TEMAS.territorio,
            query: { v: 'grafico' },
            painel: [
                {
                    visualizacao: 'mapa'
                }
            ]
        },

        // --- População

        {
            pesquisa: 33,
            indicador: 29171,
            titulo: "População estimada",
            tema: TEMAS.populacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 43,
            indicador: 30282,
            titulo: "Número de domicílios",
            tema: TEMAS.populacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 33,
            indicador: 29168,
            titulo: "Densidade demográfica",
            tema: TEMAS.populacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            titulo: "Razão entre sexos (Masculino/Feminino)",
            tema: TEMAS.populacao,
            link: '27689',
            query: { v: 'grafico' },
            composicao: {
                indicadores: [
                    {
                        pesquisa: 23,
                        indicador: 27690,
                        titulo: "Masculino"
                    },

                    {
                        pesquisa: 23,
                        indicador: 27717,
                        titulo: "Feminino"
                    }
                ],

                procedimento: function (res1, res2) {
                    let first = Number.parseInt(res1, 10);
                    let second = Number.parseInt(res2, 10);
                    let total = first + second;

                    first = Number.parseFloat((first / total).toFixed(3)) * 100;
                    second = Number.parseFloat((second / total).toFixed(3)) * 100;
                    // Number.parseInt( (this.indicadores[1]/(this.indicadores[0]+this.indicadores[1])).toFixed(3) ) * 100;

                    return `${first.toFixed(1)} / ${second.toFixed(1)}`
                },

                make: function (indicadores, codigoLocalidade) {
                    return processComparacao(indicadores, codigoLocalidade, this.procedimento);
                }
            },
            painel: [
                {
                    pesquisa: 23,
                    indicador: 27690,
                    titulo: "Masculino",
                    visualizacao: 'mapa'
                },

                {
                    pesquisa: 23,
                    indicador: 27717,
                    titulo: "Feminino",
                    visualizacao: 'mapa'
                },

                {
                    pesquisa: 23,
                    indicador: 27690,
                    titulo: "Masculino",
                    visualizacao: 'grafico'
                },

                {
                    pesquisa: 23,
                    indicador: 27717,
                    titulo: "Feminino",
                    visualizacao: 'grafico'
                }
            ]
        },

        {
            titulo: "Razão entre situação domiciliar (Urbana/Rural)",
            tema: TEMAS.populacao,
            link: '28912',
            query: { v: 'grafico' },
            composicao: {
                indicadores: [
                    {
                        pesquisa: 23,
                        indicador: 28913,
                        titulo: "Urbana"
                    },

                    {
                        pesquisa: 23,
                        indicador: 28914,
                        titulo: "Rural"
                    }
                ],

                make: function (indicadores, codigoLocalidade) {
                    return processComparacao(indicadores, codigoLocalidade, function (resultados1, resultados2) {
                        let first = Number.parseInt(resultados1, 10);
                        first = Number.isNaN(first) ? 0 : first;
                        let second = Number.parseInt(resultados2, 10);
                        second = Number.isNaN(second) ? 0 : second;
                        let total = first + second;

                        first = Number.parseFloat((first / total).toFixed(3)) * 100;
                        second = Number.parseFloat((second / total).toFixed(3)) * 100;
                        // Number.parseInt( (this.indicadores[1]/(this.indicadores[0]+this.indicadores[1])).toFixed(3) ) * 100;

                        return `${first.toFixed(1)} / ${second.toFixed(1)}`;
                    });
                }
            },
            painel: [
                {
                    pesquisa: 23,
                    indicador: 28913,
                    titulo: "Urbana",
                    visualizacao: 'grafico'
                },

                {
                    pesquisa: 23,
                    indicador: 28914,
                    titulo: "Rural",
                    visualizacao: 'grafico'
                }
            ]
        },

        // --- Economia

        {
            pesquisa: 37,
            indicador: 30255,
            titulo: "Índice de Desenvolvimento Humano Municipal (IDHM)",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 38,
            indicador: 46997,
            titulo: "PIB a preços correntes",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 38,
            indicador: 47001,
            titulo: "PIB per capita",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 21,
            indicador: 29749,
            titulo: "Despesas orçamentárias empenhadas",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 21,
            indicador: 28141,
            titulo: "Receitas orçamentárias realizadas",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 21,
            indicador: 28160,
            titulo: "Valor do Fundo de Participação dos Municípios (FPM)",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 19,
            indicador: 29763,
            titulo: "Pessoal ocupado",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 19,
            indicador: 29765,
            titulo: "Salário médio mensal",
            tema: TEMAS.economia,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        // --- Frota de Veículos

        {
            pesquisa: 22,
            indicador: 28120,
            titulo: "Total de veículos",
            tema: TEMAS.frota,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },


        // --- Educação

        {
            pesquisa: 40,
            indicador: 30277,
            titulo: "Índice de Desenvolvimento da Educação Básica (IDEB)",
            tema: TEMAS.educacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 13,
            indicador: 5903,
            titulo: "Matrículas no ensino pré-escolar",
            tema: TEMAS.educacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 13,
            indicador: 5908,
            titulo: "Matrículas no ensino fundamental",
            tema: TEMAS.educacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 13,
            indicador: 5913,
            titulo: "Matrículas no ensino médio",
            tema: TEMAS.educacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 13,
            indicador: 5918,
            titulo: "Matrículas no ensino superior",
            tema: TEMAS.educacao,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        // --- Saúde
        {
            pesquisa: 39,
            indicador: 30279,
            titulo: "Taxa de mortalidade infantil",
            tema: TEMAS.saude,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 17,
            indicador: 15752,
            titulo: "Total de óbitos hospitalares",
            tema: TEMAS.saude,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'mapa' },
                { visualizacao: 'grafico' }
            ]
        },

        {
            pesquisa: 42,
            indicador: 30280,
            titulo: "Casos de dengue registrados",
            tema: TEMAS.saude,
            query: { v: 'grafico' },
            painel: [
                { visualizacao: 'grafico' }
            ]
        },

    ].map(item => new PanoramaItem(item));
}

export class PanoramaItem {
    titulo: string
    tema: string
    largura?: string
    link?: string    
    pesquisa?: number
    indicador?: number
    unidade?: string
    visualizacao?: PainelItem[]

    constructor(options) {
        Object.assign(this, options);
    }
}

export class PainelItem {
    titulo: string = '';
    visualizacao: 'grafico' | 'mapa' | 'texto' = 'grafico';
    indicador: number = null;
    pesquisa: number = null;

    constructor(options) {
        Object.assign(this, options);
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