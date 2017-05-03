import { Indicador, Pesquisa } from './';

describe('Indicador Model', () => {

    describe('a classe', () => {
        let indicador: Indicador;
        const indicadorParameters = {
            "id": 5902,
            "pesquisa_id": 13,
            "posicao": "1",
            "indicador": "Matrícula",
            "classe": "T",
            "children": [],
            "nota": []
        };

        beforeEach(() => {
            indicador = Indicador.criar(indicadorParameters);
        })

        it('deve conter o método estático criar', () => {
            expect(typeof Indicador.criar).toBe('function');
        })

        it('deve criar um objeto do tipo Indicador', () => {
            expect(indicador instanceof Indicador).toBeTruthy();
        });
    });

    describe('uma instância com o mínimo de propriedades', () => {
        let indicador: Indicador;
        const pesquisaId = 13;
        const indicadorParameters = {
            "id": 5902,
            "posicao": "1",
            "indicador": "Matrícula",
            "classe": "T",
            "children": [],
            "nota": []
        };

        beforeEach(() => {
            indicador = Indicador.criar(Object.assign(indicadorParameters, { pesquisa_id: pesquisaId }));
        });

        it('deve ter um valor de id', () => {
            expect(indicador.id).toBeDefined()
            expect(indicador.id).toBe(indicadorParameters.id)
        });

        it('deve ter um valor de nome', () => {
            expect(indicador.nome).toBeDefined()
            expect(indicador.nome).toBe(indicadorParameters.indicador)
        });

        it('deve ter um valor de posicao', () => {
            expect(indicador.posicao).toBeDefined()
            expect(indicador.posicao).toBe(indicadorParameters.posicao)
        });

        it('deve ter um valor de classe', () => {
            expect(indicador.classe).toBeDefined()
            expect(indicador.classe).toBe(indicadorParameters.classe)
        });

        it('deve ter um valor de pesquisaId', () => {
            expect(indicador.pesquisaId).toBeDefined()
            expect(indicador.pesquisaId).toBe(pesquisaId)
        });

        it('deve ter um valor de indicadores', () => {
            expect(indicador.indicadores).toBeDefined()
            expect(indicador.indicadores).not.toBe(indicadorParameters.children)
            expect(indicador.indicadores).toEqual(indicadorParameters.children)
        });

        it('deve ter um valor de notas', () => {
            expect(indicador.notas).toBeDefined()
            expect(indicador.notas).not.toBe(indicadorParameters.nota)
            expect(indicador.notas).toEqual(indicadorParameters.nota)
        });

        it('deve ter um valor de metadados', () => {
            expect(indicador.metadados).toBeDefined()
            expect(indicador.metadados).toEqual({ descricao: '', calculo: '' })
        });

        it('deve ter um valor de unidade', () => {
            expect(indicador.unidade).toBeDefined()
            expect(indicador.unidade).toEqual({ nome: '', classe: '', multiplicador: 1 })
        });
    })

    describe('uma instância com os indicadores filhos', () => {
        let indicador: Indicador;
        const pesquisaId = 13;
        const indicadorParameters = {
            "id": 5903,
            "posicao": "1.1",
            "indicador": "Ensino pré-escolar",
            "classe": "I",
            "unidade": {
                "id": "Matrículas",
                "classe": "G",
                "multiplicador": 0
            },
            "children": [
                {
                    "id": 5904,
                    "posicao": "1.1.1",
                    "indicador": "Escola pública municipal",
                    "classe": "I",
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "N",
                        "multiplicador": 1
                    },
                    "children": [],
                    "nota": []
                },
                {
                    "id": 5905,
                    "posicao": "1.1.2",
                    "indicador": "Escola pública estadual",
                    "classe": "I",
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "G",
                        "multiplicador": 0
                    },
                    "children": [],
                    "nota": []
                },
                {
                    "id": 5906,
                    "posicao": "1.1.3",
                    "indicador": "Escola pública federal",
                    "classe": "I",
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "G",
                        "multiplicador": 0
                    },
                    "children": [],
                    "nota": []
                },
                {
                    "id": 5907,
                    "posicao": "1.1.4",
                    "indicador": "Escola privada",
                    "classe": "I",
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "G",
                        "multiplicador": 0
                    },
                    "children": [],
                    "nota": []
                }
            ],
            "nota": []
        }

        beforeEach(() => {
            indicador = Indicador.criar(Object.assign(indicadorParameters, { pesquisa_id: pesquisaId }));
        });

        it('deve conter instâncias de Indicador na propriedade indicador', () => {
            expect(indicador.indicadores.length).toBe(4);
            expect(indicador.indicadores.every(indicador => indicador instanceof Indicador)).toBeTruthy();
            expect(indicador.indicadores[0].pesquisaId).toBe(pesquisaId);
        })
    })

    describe('uma instância com Pesquisa', () => {
        let indicador: Indicador;
        const pesquisaId = 13;
        const indicadorParameters = {
            "id": 5903,
            "posicao": "1.1",
            "indicador": "Ensino pré-escolar",
            "classe": "I",
            "pesquisa_id": 13,
            "unidade": {
                "id": "Matrículas",
                "classe": "G",
                "multiplicador": 0
            },
            "children": [
                {
                    "id": 5904,
                    "posicao": "1.1.1",
                    "indicador": "Escola pública municipal",
                    "classe": "I",
                    "pesquisa_id": 13,
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "N",
                        "multiplicador": 1
                    },
                    "children": [],
                    "nota": []
                },
                {
                    "id": 5905,
                    "posicao": "1.1.2",
                    "indicador": "Escola pública estadual",
                    "classe": "I",
                    "pesquisa_id": 13,
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "G",
                        "multiplicador": 0
                    },
                    "children": [],
                    "nota": []
                },
                {
                    "id": 5906,
                    "posicao": "1.1.3",
                    "indicador": "Escola pública federal",
                    "classe": "I",
                    "pesquisa_id": 13,
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "G",
                        "multiplicador": 0
                    },
                    "children": [],
                    "nota": []
                },
                {
                    "id": 5907,
                    "posicao": "1.1.4",
                    "indicador": "Escola privada",
                    "classe": "I",
                    "pesquisa_id": 13,
                    "unidade": {
                        "id": "Matrículas",
                        "classe": "G",
                        "multiplicador": 0
                    },
                    "children": [],
                    "nota": []
                }
            ],
            "nota": []
        }
        const pesquisa = Pesquisa.criar({
            "id": 13, "nome": "Ensino - matrículas, docentes e rede escolar", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"], "nota": [], "periodo": "2005", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"], "nota": [], "periodo": "2007", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2009"], "nota": [], "periodo": "2009", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2012"], "nota": [], "periodo": "2012", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2015"], "nota": [], "periodo": "2015", "publicacao": "24/11/2016 16:25:43" }]
        })

        beforeEach(() => {
            indicador = Indicador.criar(Object.assign(indicadorParameters, { pesquisa: pesquisa }));
        });

        it('deve conter o objeto Pesquisa na propriedade pesquisa', () => {
            expect(indicador.pesquisa).toBeDefined();
            expect(indicador.pesquisa instanceof Pesquisa).toBeTruthy();
            expect(indicador.pesquisa).toBe(pesquisa);
        })

        it('não deve ter a propriedade pesquisaId', () => {
            expect(indicador.pesquisaId).toBeUndefined();
            expect(indicador.hasOwnProperty('pesquisaId')).toBeFalsy();
        })
    })
})