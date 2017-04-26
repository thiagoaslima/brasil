import { Indicador } from './';

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
            indicador = Indicador.criar(Object.assign(indicadorParameters, {pesquisa_id: pesquisaId}));
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
            expect(indicador.metadados).toEqual({descricao: '', calculo: ''})
        });

        it('deve ter um valor de unidade', () => {
            expect(indicador.unidade).toBeDefined()
            expect(indicador.unidade).toEqual({nome: '', classe: '', multiplicador: 1})
        });
    })
})