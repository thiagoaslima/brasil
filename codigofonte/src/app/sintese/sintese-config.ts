import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/zip';

export interface SinteseConfigItem {
    nome: string
    tema: string
    largura?: string
    link?: string
    pesquisa?: number
    indicador?: number
    composicao?: {
        indicadores: SinteseConfigItem[],
        make: Function,
        procedimento?: Function
    },
    unidade?: string
}

export const TEMAS = {
    vazio: "",
    historico: 'Histórico',
    territorio: "Território",
    populacao: "População",
    economia: "Economia",
    frota: "Frota de veículos",
    educacao: "Educação",
    saude: "Saúde"
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

export class SINTESE {
    temas = [
        TEMAS.vazio,
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

    municipio = <SinteseConfigItem[]>[
        {
            pesquisa: 33,
            indicador: 29169,
            nome: "Código do Município",
            tema: TEMAS.vazio,
            largura: 'half'
        },

        {
            pesquisa: 33,
            indicador: 29170,
            nome: "Prefeito",
            tema: TEMAS.vazio,
            largura: 'half'
        },

        {
            nome: "Fotografia",
            tema: TEMAS.historico,
            link: "fotos"
        },

        {
            nome: "Histórico",
            tema: TEMAS.historico,
            link: "historico"
        },

        // --- Território

        {
            pesquisa: 33,
            indicador: 29167,
            nome: "Área Territorial",
            tema: TEMAS.territorio
        },

        // --- População

        {
            pesquisa: 33,
            indicador: 29171,
            nome: "População estimada",
            tema: TEMAS.populacao
        },

        {
            pesquisa: 43,
            indicador: 30282,
            nome: "Número de domicílios",
            tema: TEMAS.populacao
        },

        {
            pesquisa: 33,
            indicador: 29168,
            nome: "Densidade demográfica",
            tema: TEMAS.populacao
        },

        {
            nome: "Razão entre sexos (Masculino/Feminino)",
            tema: TEMAS.populacao,
            link: '27689',
            composicao: {
                indicadores: [
                    {
                        pesquisa: 23,
                        indicador: 27690,
                        nome: "Masculino"
                    },

                    {
                        pesquisa: 23,
                        indicador: 27717,
                        nome: "Feminino"
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
                    /*
                    return Observable.zip(
                        indicadores[0].resultadosValidosMaisRecentes(codigoLocalidade),
                        indicadores[1].resultadosValidosMaisRecentes(codigoLocalidade)
                    ).map(([resultados1, resultados2]) => {
                        let first = Number.parseInt(resultados1['resultados'], 10);
                        let second = Number.parseInt(resultados1['resultados'], 10);
                        let total = first + second;

                        first = Number.parseFloat((first / total).toFixed(3)) * 100;
                        second = Number.parseFloat((second / total).toFixed(3)) * 100;
                        // Number.parseInt( (this.indicadores[1]/(this.indicadores[0]+this.indicadores[1])).toFixed(3) ) * 100;

                        return `${first.toFixed(1)} / ${second.toFixed(1)}`;
                    });
                    */
                }
            }
        },

        {
            nome: "Razão entre situação domiciliar (Urbana/Rural)",
            tema: TEMAS.populacao,
            link: '28912',
            composicao: {
                indicadores: [
                    {
                        pesquisa: 23,
                        indicador: 28913,
                        nome: "Urbana"
                    },

                    {
                        pesquisa: 23,
                        indicador: 28914,
                        nome: "Rural"
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
            }
        },

        // --- Economia

        {
            pesquisa: 37,
            indicador: 30255,
            nome: "Índice de Desenvolvimento Humano Municipal (IDHM)",
            tema: TEMAS.economia
        },

        {
            pesquisa: 38,
            indicador: 46997,
            nome: "PIB a preços correntes",
            tema: TEMAS.economia
        },

        {
            pesquisa: 38,
            indicador: 47001,
            nome: "PIB per capita",
            tema: TEMAS.economia
        },

        {
            pesquisa: 21,
            indicador: 29749,
            nome: "Despesas orçamentárias empenhadas",
            tema: TEMAS.economia
        },

        {
            pesquisa: 21,
            indicador: 28141,
            nome: "Receitas orçamentárias realizadas",
            tema: TEMAS.economia
        },

        {
            pesquisa: 21,
            indicador: 28160,
            nome: "Valor do Fundo de Participação dos Municípios (FPM)",
            tema: TEMAS.economia
        },

        {
            pesquisa: 19,
            indicador: 29763,
            nome: "Pessoal ocupado",
            tema: TEMAS.economia
        },

        {
            pesquisa: 19,
            indicador: 29765,
            nome: "Salário médio mensal",
            tema: TEMAS.economia
        },

        // --- Frota de Veículos

        {
            pesquisa: 22,
            indicador: 28120,
            nome: "Total de veículos",
            tema: TEMAS.frota
        },


        // --- Educação

        {
            pesquisa: 40,
            indicador: 30277,
            nome: "Índice de Desenvolvimento da Educação Básica (IDEB)",
            tema: TEMAS.educacao
        },

        {
            pesquisa: 13,
            indicador: 5903,
            nome: "Matrículas no ensino pré-escolar",
            tema: TEMAS.educacao
        },

        {
            pesquisa: 13,
            indicador: 5908,
            nome: "Matrículas no ensino fundamental",
            tema: TEMAS.educacao
        },

        {
            pesquisa: 13,
            indicador: 5913,
            nome: "Matrículas no ensino médio",
            tema: TEMAS.educacao
        },

        {
            pesquisa: 13,
            indicador: 5918,
            nome: "Matrículas no ensino superior",
            tema: TEMAS.educacao
        },

        // --- Saúde
        {
            pesquisa: 39,
            indicador: 30279,
            nome: "Taxa de mortalidade infantil",
            tema: TEMAS.saude
        },

        {
            pesquisa: 17,
            indicador: 15752,
            nome: "Total de óbitos hospitalares",
            tema: TEMAS.saude
        },

        {
            pesquisa: 42,
            indicador: 30280,
            nome: "Casos de dengue registrados",
            tema: TEMAS.saude
        },

    ]
}