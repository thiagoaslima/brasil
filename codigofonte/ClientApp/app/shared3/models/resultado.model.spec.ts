import { Resultado } from './resultado.model';

describe('Resultado Model', () => {
    const resultadoDTO = {
        "id": 5903, "res": [{ "localidade": "330455", "res": { "2005": "172242", "2007": "126100", "2009": "128983", "2012": "128154", "2015": "137100" } }]
    };

    it('deve possuir o método estático criar', () => {
        expect(typeof Resultado.criar).toBe('function')
    })

    it('deve converter o objeto do servidor em parâmetro para o construtor de Resultado', () => {
        const expected = [
            { id: 5903, localidade: "330455", res: { "2005": "172242", "2007": "126100", "2009": "128983", "2012": "128154", "2015": "137100" } }
        ];
        expect(Resultado.convertDTOintoParameters(resultadoDTO)).toEqual(expected)
    })

    it('deve gerar objetos do tipo Resultado', () => {
        const actual = Resultado.convertDTOintoParameters(resultadoDTO).map(param => Resultado.criar(param))[0];
        const expected = { indicadorId: 5903, localidadeCodigo: 330455, periodos: ["2015", "2012", "2009", "2007", "2005"], valores: ["137100", "128154", "128983", "126100", "172242"] } as Resultado

        expect(actual).toEqual(expected)
    })

    it('deve gerar um objeto Resultado para cada par Indicador-Localidade', () => {
        const dto = [{ "id": 5903, "res": [{ "localidade": "330010", "res": { "2005": "3036", "2007": "2785", "2009": "2681", "2012": "3154", "2015": "3143" } }, { "localidade": "330455", "res": { "2005": "172242", "2007": "126100", "2009": "128983", "2012": "128154", "2015": "137100" } }] }, { "id": 5904, "res": [{ "localidade": "330010", "res": { "2005": "1498", "2007": "1307", "2009": "1204", "2012": "1779", "2015": "1789" } }, { "localidade": "330455", "res": { "2005": "99894", "2007": "91237", "2009": "78651", "2012": "71871", "2015": "79638" } }] }]
        const actual = Resultado.convertDTOintoParameters(dto).map(Resultado.criar);

        expect(actual.length).toBe(4)
        expect(actual[0].indicadorId).toBe(5903)
        expect(actual[0].localidadeCodigo).toBe(330010)
        expect(actual[1].indicadorId).toBe(5903)
        expect(actual[1].localidadeCodigo).toBe(330455)
        expect(actual[2].indicadorId).toBe(5904)
        expect(actual[2].localidadeCodigo).toBe(330010)
        expect(actual[3].indicadorId).toBe(5904)
        expect(actual[3].localidadeCodigo).toBe(330455)
    })

    describe('instância', () => {
        const resultadoDTO = {
            "id": 123456789, "res": [{ "localidade": "987654321", "res": { "2002": "2", "2001": null, "2004": "4", "2005": "5", "2003": "3" } }]
        };
        const resultado = Resultado.convertDTOintoParameters(resultadoDTO).map(Resultado.criar)[0];

        it('valores', () => {
            expect(resultado.valores).toEqual(["5", "4", "3", "2", null])
        })

        it('valoresValidos', () => {
            expect(resultado.valoresValidos).toEqual(["5", "4", "3", "2"])
        })

        it('valorValidoMaisRecente', () => {
            expect(resultado.valorValidoMaisRecente).toBe("5")
        })

        it('periodos', () => {
            expect(resultado.periodos).toEqual(["2005", "2004", "2003", "2002", "2001"])
        })

        it('periodosValidos', () => {
            expect(resultado.periodosValidos).toEqual(["2005", "2004", "2003", "2002"])
        })

        it('periodoValidoMaisRecente', () => {
            expect(resultado.periodoValidoMaisRecente).toBe("2005")
        })
    })

    describe('instância sem valor', () => {
        let resultado = Resultado.criar({id: 1, localidade: "1"})

        it('deve criar uma instância com periodos e valores valendo []', () => {
            expect(resultado.periodos).toEqual([]);
            expect(resultado.valores).toEqual([]);
        })

        it('valoresValidos == []', () => {
            expect(resultado.valoresValidos).toEqual([]);
        })

        it('valorValidoMaisRecente == "-"', () => {
            expect(resultado.valorValidoMaisRecente).toBe("-");
        })

        it('periodosValidos == []', () => {
            expect(resultado.periodosValidos).toEqual([]);
        })

        it('periodoValidoMaisRecente == "-"', () => {
            expect(resultado.periodoValidoMaisRecente).toBe("-");
        })
    })
})