import { Pesquisa } from './pesquisa.model';

const pesquisaParameter = {
    "id": 13,
    "nome": "Ensino - matrículas, docentes e rede escolar",
    "descricao": null,
    "contexto": "1010",
    "observacao": null,
    "periodos": [
        {
            "fonte": [
                "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"
            ],
            "nota": [
                "Nota1",
                "Nota2"
            ],
            "periodo": "2005",
            "publicacao": "05/01/2016 14:46:24"
        },
        {
            "fonte": [
                "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005",
                "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"
            ],
            "nota": [
                "Nota1",
                "Nota3",
                "Nota4"
            ],
            "periodo": "2007",
            "publicacao": "05/01/2016 14:46:24"
        }
    ]
}



describe('Pesquisa model', () => {
    let pesquisa: Pesquisa;

    beforeEach(() => {
        pesquisa = Pesquisa.criar(pesquisaParameter);
    })

    it('deve conter o método estático criar', () => {
        expect(typeof Pesquisa.criar).toBe('function');
    })

    it('deve criar um objeto do tipo Pesquisa', () => {
        expect(pesquisa instanceof Pesquisa).toBeTruthy();
    });

    it('deve criar uma instância com todas as propriedades definidas pelo modelo', () => {
        const peridosGerados = [
            {
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"
                ],
                "notas": [
                    "Nota1",
                    "Nota2"
                ],
                "nome": "2005",
                "dataPublicacao": new Date(Date.UTC(2016, 0, 5, 14, 46, 24))
            },
            {
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005",
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"
                ],
                "notas": [
                    "Nota1",
                    "Nota3",
                    "Nota4"
                ],
                "nome": "2007",
                "dataPublicacao": new Date(Date.UTC(2016, 0, 5, 14, 46, 24))
            }
        ];

        const contextos = {
            pais: false,
            macrorregiao: false,
            uf: true,
            ufSub: false,
            municipio: true,
            municipioSub: false
        }

        expect(pesquisa.id).toBe(pesquisaParameter.id);
        expect(pesquisa.nome).toBe(pesquisaParameter.nome);
        expect(pesquisa.descricao).toBe("");
        expect(pesquisa.observacao).toBe("");
        expect(pesquisa.periodos).toEqual(peridosGerados);
        expect(pesquisa.contextos).toEqual(contextos);
    })

    it('deve criar as datas de publicação com o tempo correto', () => {
        expect(pesquisa.periodos[0].dataPublicacao.toISOString()).toBe("2016-01-05T14:46:24.000Z")
    })

    it('deve listar a abrangência territorial da pesquisa', () => {
        expect(pesquisa.getAbrangenciaTerritorialDaPesquisa()).toEqual(['uf', 'municipio']);
    })

    it('deve retornar as notas de determinado período', () => {
        expect(pesquisa.getNotasDoPeriodo('2005')).toEqual(["Nota1", "Nota2"])
    })

    it('deve listar todas as notas, removendo as iguais', () => {
        expect(pesquisa.getAllNotas()).toEqual(["Nota1", "Nota2", "Nota3", "Nota4"])
    })

    it('deve retornar as fontes de determinado período', () => {
        expect(pesquisa.getFontesDoPeriodo('2005')).toEqual(["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"])
    })

    it('deve listar todas as fontes, removendo as iguais', () => {
        expect(pesquisa.getAllFontes()).toEqual(["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005", "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"])
    })
})