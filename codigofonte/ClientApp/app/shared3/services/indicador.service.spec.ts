import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Indicador, Pesquisa } from '../models';
import { IndicadorService3, PesquisaService3 } from './';
import { ServicoDados as servidor } from '../values'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('IndicadorService', () => {
    let connection, mockResponse, serviceResponse, serverResponse;

    describe('getIndicadoresById', () => {
        let pesquisas;

        beforeEach(() => {
            TestBed.resetTestingModule();

            const indicadores = [
                { "id": 5905, "pesquisa_id": 13, "posicao": "1.1.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5906, "pesquisa_id": 13, "posicao": "1.1.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 28135, "pesquisa_id": 21, "posicao": "1.1.1", "indicador": "Capital", "classe": "I", "unidade": { "id": "R$", "classe": "$", "multiplicador": 1000 }, "children": [], "nota": [] }, { "id": 28136, "pesquisa_id": 21, "posicao": "1.1.2", "indicador": "Correntes", "classe": "I", "unidade": { "id": "R$", "classe": "$", "multiplicador": 1000 }, "children": [], "nota": [] }
            ]
            pesquisas = {
                "13": Pesquisa.criar({
                    "id": 13, "nome": "Ensino - matrículas, docentes e rede escolar", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"], "nota": [], "periodo": "2005", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"], "nota": [], "periodo": "2007", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2009"], "nota": [], "periodo": "2009", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2012"], "nota": [], "periodo": "2012", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2015"], "nota": [], "periodo": "2015", "publicacao": "24/11/2016 16:25:43" }]
                }),
                "21": Pesquisa.criar({
                    "id": 21, "nome": "Finanças públicas", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2005; Rio de Janeiro: IBGE, 2007"], "nota": [], "periodo": "2005", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2006; Rio de Janeiro: IBGE, 2008"], "nota": [], "periodo": "2006", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2008"], "nota": ["Os totais de Brasil e Unidades da Federação são a soma dos valores dos municípios", "Atribui-se a expressão dado não informado às variáveis nas quais os valores dos municípios não foram informados", "Atribui-se zeros aos valores dos municípios nos quais não há ocorrência da variável"], "periodo": "2008", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2009"], "nota": ["Os totais de Brasil e Unidades da Federação são a soma dos valores dos municípios", "Atribui-se a expressão dado não informado às variáveis nas quais os valores dos municípios não foram informados", "Atribui-se zeros aos valores dos municípios nos quais não há ocorrência da variável"], "periodo": "2009", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2013 e Despesas orçamentárias empenhadas (Anexo I-D) 2013. In: Brasil. Secretaria do Tesouro Nacional", "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "nota": ["Atualizado em 28/08/2015, às 16:15h. Os valores estavam 100 vezes menores em função de erro no formato de exibição", "Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2013 e Despesas orçamentárias empenhadas (Anexo I-D) 2013. In: Brasil. Secretaria do Tesouro Nacional. Siconfi: sistema de informações contábeis e fiscais do setor público brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "periodo": "2013", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2014 e Despesas orçamentárias empenhadas (Anexo I-D) 2014. In: Brasil. Secretaria do Tesouro Nacional", "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "nota": ["A DCA do Estado de Rio Grande do Norte foi desconsiderada no FINBRA por causa de inconsistências. Favor veja a notícia que fala sobre este assunto no link: https://siconfi.tesouro.gov.br/siconfi/pages/public/conteudo/conteudo.jsf?id=2701", "Atualizado em 28/08/2015, às 16:15h. Os valores estavam 100 vezes menores em função de erro no formato de exibição"], "periodo": "2014", "publicacao": "07/10/2016 16:40:05" }]
                })
            }

            mockResponse = {
                [servidor.setUrl('pesquisas/indicadores/5905|5906|28135|28136?localidade=')]: new Response(new ResponseOptions({ body: indicadores, status: 200 })),
                [servidor.setUrl('pesquisas/indicadores/999999?localidade=')]: new Response(new ResponseOptions({ body: [], status: 200 })),
                [servidor.setUrl('pesquisas/indicadores/?localidade=')]: new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 500 })),
            };

            serverResponse = null;
            serviceResponse = null;
            connection = null;

            class PesquisaServiceStub extends PesquisaService3 {
                constructor(http: Http) {
                    super(http);
                }

                getPesquisas(ids) {
                    return Observable.of(ids.map(id => pesquisas[id]));
                }
            }


            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: PesquisaService3,
                        deps: [Http],
                        useFactory: (http) => new PesquisaServiceStub(http)
                    },
                    {
                        provide: IndicadorService3,
                        deps: [Http, PesquisaService3],
                        useFactory: (http, pesquisaService) => new IndicadorService3(http, pesquisaService)
                    },
                    MockBackend,
                    BaseRequestOptions,
                    {
                        provide: Http,
                        deps: [MockBackend, BaseRequestOptions],
                        useFactory: (backend, options) => new Http(backend, options)
                    }
                ]
            })
        })

        it('deve ser instanciado',
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    expect(indicadorService).toBeDefined();
                })
        )

        it('deve retornar um array de indicadores', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(4)
                    expect(serviceResponse[0].id).toBe(5905)
                    expect(serviceResponse[1].id).toBe(5906)
                    expect(serviceResponse[2].id).toBe(28135)
                    expect(serviceResponse[3].id).toBe(28136)
                })
        ));

        it('cada indicador deve conter o id da pesquisa a qual pertence na propriedade "pesquisaId"', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(4)
                    expect(serviceResponse[0].pesquisaId).toBe(13)
                    expect(serviceResponse[1].pesquisaId).toBe(13)
                    expect(serviceResponse[2].pesquisaId).toBe(21)
                    expect(serviceResponse[3].pesquisaId).toBe(21)
                })
        ))

        it('ignora id inexistente de indicador', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([999999]).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(0)
                    expect(serviceResponse[0]).toBeUndefined()
                })
        ))

        it('retorna erro caso não seja informado id ou seja passado um valor de id inválido', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([]).subscribe(() => { }, err => serviceResponse = err.message)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse).toBe('Não foi possível retornar indicadores para os parâmetros informados. [id: nenhum valor informado]')
                })
        ))

        describe('passando código de localidade', () => {
            beforeEach(() => {
                TestBed.resetTestingModule();

                const indicadores = [
                    {"id":5905,"pesquisa_id":13,"posicao":"1.1.2","indicador":"Escola pública estadual","classe":"I","unidade":{"id":"Matrículas","classe":"G","multiplicador":1},"children":[],"nota":[],"res":[{"localidade":"330010","res":{"2005":"44","2007":"68","2009":"8","2012":"7","2015":"0"}},{"localidade":"330455","res":{"2005":"959","2007":"615","2009":"394","2012":"203","2015":"191"}}]},{"id":5906,"pesquisa_id":13,"posicao":"1.1.3","indicador":"Escola pública federal","classe":"I","unidade":{"id":"Matrículas","classe":"G","multiplicador":1},"children":[],"nota":[],"res":[{"localidade":"330010","res":{"2005":"0","2007":"0","2009":"0","2012":"0","2015":"0"}},{"localidade":"330455","res":{"2005":"228","2007":"88","2009":"74","2012":"240","2015":"344"}}]},{"id":28135,"pesquisa_id":21,"posicao":"1.1.1","indicador":"Capital","classe":"I","unidade":{"id":"R$","classe":"$","multiplicador":1000},"children":[],"nota":[],"res":[{"localidade":"330010","res":{"2009":"52480","2013":"27204","2014":"99999999999997"}},{"localidade":"330455","res":{"2009":"861785","2013":"3371405","2014":"4266628"}}]},{"id":28136,"pesquisa_id":21,"posicao":"1.1.2","indicador":"Correntes","classe":"I","unidade":{"id":"R$","classe":"$","multiplicador":1000},"children":[],"nota":[],"res":[{"localidade":"330010","res":{"2009":"444571","2013":"760954","2014":"99999999999997"}},{"localidade":"330455","res":{"2009":"9908361","2013":"18445928","2014":"20265108"}}]}
                ]
                pesquisas = {
                    "13": Pesquisa.criar({
                        "id": 13, "nome": "Ensino - matrículas, docentes e rede escolar", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"], "nota": [], "periodo": "2005", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"], "nota": [], "periodo": "2007", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2009"], "nota": [], "periodo": "2009", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2012"], "nota": [], "periodo": "2012", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2015"], "nota": [], "periodo": "2015", "publicacao": "24/11/2016 16:25:43" }]
                    }),
                    "21": Pesquisa.criar({
                        "id": 21, "nome": "Finanças públicas", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2005; Rio de Janeiro: IBGE, 2007"], "nota": [], "periodo": "2005", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2006; Rio de Janeiro: IBGE, 2008"], "nota": [], "periodo": "2006", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2008"], "nota": ["Os totais de Brasil e Unidades da Federação são a soma dos valores dos municípios", "Atribui-se a expressão dado não informado às variáveis nas quais os valores dos municípios não foram informados", "Atribui-se zeros aos valores dos municípios nos quais não há ocorrência da variável"], "periodo": "2008", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2009"], "nota": ["Os totais de Brasil e Unidades da Federação são a soma dos valores dos municípios", "Atribui-se a expressão dado não informado às variáveis nas quais os valores dos municípios não foram informados", "Atribui-se zeros aos valores dos municípios nos quais não há ocorrência da variável"], "periodo": "2009", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2013 e Despesas orçamentárias empenhadas (Anexo I-D) 2013. In: Brasil. Secretaria do Tesouro Nacional", "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "nota": ["Atualizado em 28/08/2015, às 16:15h. Os valores estavam 100 vezes menores em função de erro no formato de exibição", "Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2013 e Despesas orçamentárias empenhadas (Anexo I-D) 2013. In: Brasil. Secretaria do Tesouro Nacional. Siconfi: sistema de informações contábeis e fiscais do setor público brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "periodo": "2013", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2014 e Despesas orçamentárias empenhadas (Anexo I-D) 2014. In: Brasil. Secretaria do Tesouro Nacional", "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "nota": ["A DCA do Estado de Rio Grande do Norte foi desconsiderada no FINBRA por causa de inconsistências. Favor veja a notícia que fala sobre este assunto no link: https://siconfi.tesouro.gov.br/siconfi/pages/public/conteudo/conteudo.jsf?id=2701", "Atualizado em 28/08/2015, às 16:15h. Os valores estavam 100 vezes menores em função de erro no formato de exibição"], "periodo": "2014", "publicacao": "07/10/2016 16:40:05" }]
                    })
                }

                mockResponse = {
                    [servidor.setUrl('pesquisas/indicadores/5905|5906|28135|28136?localidade=')]: new Response(new ResponseOptions({ body: indicadores, status: 200 })),
                    [servidor.setUrl('pesquisas/indicadores/999999?localidade=')]: new Response(new ResponseOptions({ body: [], status: 200 })),
                    [servidor.setUrl('pesquisas/indicadores/?localidade=')]: new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 500 })),
                };

                serverResponse = null;
                serviceResponse = null;
                connection = null;

                class PesquisaServiceStub extends PesquisaService3 {
                    constructor(http: Http) {
                        super(http);
                    }

                    getPesquisas(ids) {
                        return Observable.of(ids.map(id => pesquisas[id]));
                    }
                }


                TestBed.configureTestingModule({
                    providers: [
                        {
                            provide: PesquisaService3,
                            deps: [Http],
                            useFactory: (http) => new PesquisaServiceStub(http)
                        },
                        {
                            provide: IndicadorService3,
                            deps: [Http, PesquisaService3],
                            useFactory: (http, pesquisaService) => new IndicadorService3(http, pesquisaService)
                        },
                        MockBackend,
                        BaseRequestOptions,
                        {
                            provide: Http,
                            deps: [MockBackend, BaseRequestOptions],
                            useFactory: (backend, options) => new Http(backend, options)
                        }
                    ]
                })
            })

            it('deve construir instancias de Indicador com Resultado', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();
    
                        expect(serviceResponse.length).toBe(4)
                        expect(serviceResponse[0].resultados).toBeDefined()
                        expect(serviceResponse[1].resultados).toBeDefined()
                        expect(serviceResponse[2].resultados).toBeDefined()
                        expect(serviceResponse[3].resultados).toBeDefined()
                    }
            ))

            )
        })
    })

    describe('getIndicadoresComPesquisaById', () => {
        let pesquisas;

        beforeEach(() => {
            TestBed.resetTestingModule();

            const indicadores = [
                { "id": 5905, "pesquisa_id": 13, "posicao": "1.1.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5906, "pesquisa_id": 13, "posicao": "1.1.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 28135, "pesquisa_id": 21, "posicao": "1.1.1", "indicador": "Capital", "classe": "I", "unidade": { "id": "R$", "classe": "$", "multiplicador": 1000 }, "children": [], "nota": [] }, { "id": 28136, "pesquisa_id": 21, "posicao": "1.1.2", "indicador": "Correntes", "classe": "I", "unidade": { "id": "R$", "classe": "$", "multiplicador": 1000 }, "children": [], "nota": [] }
            ]
            pesquisas = {
                "13": Pesquisa.criar({
                    "id": 13, "nome": "Ensino - matrículas, docentes e rede escolar", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"], "nota": [], "periodo": "2005", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"], "nota": [], "periodo": "2007", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2009"], "nota": [], "periodo": "2009", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2012"], "nota": [], "periodo": "2012", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2015"], "nota": [], "periodo": "2015", "publicacao": "24/11/2016 16:25:43" }]
                }),
                "21": Pesquisa.criar({
                    "id": 21, "nome": "Finanças públicas", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2005; Rio de Janeiro: IBGE, 2007"], "nota": [], "periodo": "2005", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2006; Rio de Janeiro: IBGE, 2008"], "nota": [], "periodo": "2006", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2008"], "nota": ["Os totais de Brasil e Unidades da Federação são a soma dos valores dos municípios", "Atribui-se a expressão dado não informado às variáveis nas quais os valores dos municípios não foram informados", "Atribui-se zeros aos valores dos municípios nos quais não há ocorrência da variável"], "periodo": "2008", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Ministério da Fazenda, Secretaria do Tesouro Nacional, Registros administrativos 2009"], "nota": ["Os totais de Brasil e Unidades da Federação são a soma dos valores dos municípios", "Atribui-se a expressão dado não informado às variáveis nas quais os valores dos municípios não foram informados", "Atribui-se zeros aos valores dos municípios nos quais não há ocorrência da variável"], "periodo": "2009", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2013 e Despesas orçamentárias empenhadas (Anexo I-D) 2013. In: Brasil. Secretaria do Tesouro Nacional", "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "nota": ["Atualizado em 28/08/2015, às 16:15h. Os valores estavam 100 vezes menores em função de erro no formato de exibição", "Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2013 e Despesas orçamentárias empenhadas (Anexo I-D) 2013. In: Brasil. Secretaria do Tesouro Nacional. Siconfi: sistema de informações contábeis e fiscais do setor público brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "periodo": "2013", "publicacao": "07/10/2016 16:40:05" }, { "fonte": ["Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2014 e Despesas orçamentárias empenhadas (Anexo I-D) 2014. In: Brasil. Secretaria do Tesouro Nacional", "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2015]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/index.jsf. Acesso em: jul. 2015"], "nota": ["A DCA do Estado de Rio Grande do Norte foi desconsiderada no FINBRA por causa de inconsistências. Favor veja a notícia que fala sobre este assunto no link: https://siconfi.tesouro.gov.br/siconfi/pages/public/conteudo/conteudo.jsf?id=2701", "Atualizado em 28/08/2015, às 16:15h. Os valores estavam 100 vezes menores em função de erro no formato de exibição"], "periodo": "2014", "publicacao": "07/10/2016 16:40:05" }]
                })
            }

            mockResponse = {
                [servidor.setUrl('pesquisas/indicadores/5905|5906|28135|28136?localidade=')]: new Response(new ResponseOptions({ body: indicadores, status: 200 })),
                [servidor.setUrl('pesquisas/indicadores/999999?localidade=')]: new Response(new ResponseOptions({ body: [], status: 200 })),
                [servidor.setUrl('pesquisas/indicadores/?localidade=')]: new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 500 })),
            };

            serverResponse = null;
            serviceResponse = null;
            connection = null;

            class PesquisaServiceStub extends PesquisaService3 {
                constructor(http: Http) {
                    super(http);
                }

                getPesquisas(ids) {
                    return Observable.of(ids.map(id => pesquisas[id]));
                }
            }


            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: PesquisaService3,
                        deps: [Http],
                        useFactory: (http) => new PesquisaServiceStub(http)
                    },
                    {
                        provide: IndicadorService3,
                        deps: [Http, PesquisaService3],
                        useFactory: (http, pesquisaService) => new IndicadorService3(http, pesquisaService)
                    },
                    MockBackend,
                    BaseRequestOptions,
                    {
                        provide: Http,
                        deps: [MockBackend, BaseRequestOptions],
                        useFactory: (backend, options) => new Http(backend, options)
                    }
                ]
            })
        })

        it('deve ser instanciado',
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    expect(indicadorService).toBeDefined();
                })
        )

        it('deve retornar um array de indicadores', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(4)
                    expect(serviceResponse[0].id).toBe(5905)
                    expect(serviceResponse[1].id).toBe(5906)
                    expect(serviceResponse[2].id).toBe(28135)
                    expect(serviceResponse[3].id).toBe(28136)
                })
        ));

        it('cada indicador deve conter o objecto da pesquisa a qual pertence na propriedade "pesquisa"', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(4)
                    expect(serviceResponse[0].pesquisa).toBe(pesquisas[0])
                    expect(serviceResponse[1].pesquisa).toBe(pesquisas[0])
                    expect(serviceResponse[2].pesquisa).toBe(pesquisas[1])
                    expect(serviceResponse[3].pesquisa).toBe(pesquisas[1])
                })
        ))

        it('ignora id inexistente de indicador', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([999999]).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(0)
                    expect(serviceResponse[0]).toBeUndefined()
                })
        ))

        it('retorna erro caso não seja informado id ou seja passado um valor de id inválido', fakeAsync(
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    let serverResponse;

                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresById([]).subscribe(() => { }, err => serviceResponse = err.message)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse).toBe('Não foi possível retornar indicadores para os parâmetros informados. [id: nenhum valor informado]')
                })
        ))
    })

})


