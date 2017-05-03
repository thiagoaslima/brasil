import { ResponseBodyHandler } from '_debugger';
import { defaultOptions } from 'preboot/__build/src/node/preboot_node';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Indicador, Pesquisa } from '../models';
import { IndicadorService3, PesquisaService3 } from './';
import { ServicoDados as servidor } from '../values'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('IndicadorService', () => {
    let connection, mockResponse, pesquisa, serviceResponse, serverResponse;

    describe('getIndicadoresdaPesquisa', () => {

        beforeEach(() => {
            TestBed.resetTestingModule();

            const indicadores = [
                { "id": 5902, "posicao": "1", "indicador": "Matrícula", "classe": "T", "children": [], "nota": [] }, { "id": 5923, "posicao": "2", "indicador": "Docentes", "classe": "T", "children": [], "nota": [] }, { "id": 5944, "posicao": "3", "indicador": "Escolas", "classe": "T", "children": [], "nota": [] }
            ]
            const indicadores_arvoreCompleta = [
                { "id": 5902, "posicao": "1", "indicador": "Matrícula", "classe": "T", "children": [{ "id": 5903, "posicao": "1.1", "indicador": "Ensino pré-escolar", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5904, "posicao": "1.1.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "N", "multiplicador": 1 }, "children": [], "nota": [] }, { "id": 5905, "posicao": "1.1.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5906, "posicao": "1.1.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5907, "posicao": "1.1.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5908, "posicao": "1.2", "indicador": "Ensino fundamental", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5909, "posicao": "1.2.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5910, "posicao": "1.2.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5911, "posicao": "1.2.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5912, "posicao": "1.2.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5913, "posicao": "1.3", "indicador": "Ensino médio", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5914, "posicao": "1.3.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5915, "posicao": "1.3.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5916, "posicao": "1.3.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5917, "posicao": "1.3.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5918, "posicao": "1.4", "indicador": "Ensino superior", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5919, "posicao": "1.4.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5920, "posicao": "1.4.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5921, "posicao": "1.4.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5922, "posicao": "1.4.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Matrículas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }], "nota": [] }, { "id": 5923, "posicao": "2", "indicador": "Docentes", "classe": "T", "children": [{ "id": 5924, "posicao": "2.1", "indicador": "Ensino pré-escolar", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5925, "posicao": "2.1.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5926, "posicao": "2.1.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5927, "posicao": "2.1.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5928, "posicao": "2.1.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5929, "posicao": "2.2", "indicador": "Ensino fundamental", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5930, "posicao": "2.2.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5931, "posicao": "2.2.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5932, "posicao": "2.2.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5933, "posicao": "2.2.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5934, "posicao": "2.3", "indicador": "Ensino médio", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5935, "posicao": "2.3.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5936, "posicao": "2.3.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5937, "posicao": "2.3.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5938, "posicao": "2.3.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5939, "posicao": "2.4", "indicador": "Ensino superior", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5940, "posicao": "2.4.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5941, "posicao": "2.4.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5942, "posicao": "2.4.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5943, "posicao": "2.4.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Docentes", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }], "nota": [] }, { "id": 5944, "posicao": "3", "indicador": "Escolas", "classe": "T", "children": [{ "id": 5945, "posicao": "3.1", "indicador": "Ensino pré-escolar", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5946, "posicao": "3.1.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5947, "posicao": "3.1.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5948, "posicao": "3.1.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5949, "posicao": "3.1.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5950, "posicao": "3.2", "indicador": "Ensino fundamental", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5951, "posicao": "3.2.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5952, "posicao": "3.2.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5953, "posicao": "3.2.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5954, "posicao": "3.2.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5955, "posicao": "3.3", "indicador": "Ensino médio", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5956, "posicao": "3.3.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5957, "posicao": "3.3.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5958, "posicao": "3.3.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5959, "posicao": "3.3.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }, { "id": 5960, "posicao": "3.4", "indicador": "Ensino superior", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [{ "id": 5961, "posicao": "3.4.1", "indicador": "Escola pública municipal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5962, "posicao": "3.4.2", "indicador": "Escola pública estadual", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5963, "posicao": "3.4.3", "indicador": "Escola pública federal", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }, { "id": 5964, "posicao": "3.4.4", "indicador": "Escola privada", "classe": "I", "unidade": { "id": "Escolas", "classe": "G", "multiplicador": 0 }, "children": [], "nota": [] }], "nota": [] }], "nota": [] }
            ]
            pesquisa = Pesquisa.criar({
                "id": 13, "nome": "Ensino - matrículas, docentes e rede escolar", "descricao": null, "contexto": "1010", "observacao": null, "periodos": [{ "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2005"], "nota": [], "periodo": "2005", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"], "nota": [], "periodo": "2007", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2009"], "nota": [], "periodo": "2009", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2012"], "nota": [], "periodo": "2012", "publicacao": "05/01/2016 14:46:24" }, { "fonte": ["Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2015"], "nota": [], "periodo": "2015", "publicacao": "24/11/2016 16:25:43" }]
            })

            mockResponse = {
                [servidor.setUrl('pesquisas/13/periodos/all/indicadores/0?scope=sub&localidade=')]: new Response(new ResponseOptions({ body: indicadores_arvoreCompleta, status: 200 })),
                [servidor.setUrl('pesquisas/13/periodos/all/indicadores/0?scope=one&localidade=')]: new Response(new ResponseOptions({ body: indicadores, status: 200 })),
            };

            serverResponse = null;
            serviceResponse = null;
            connection = null;

            class PesquisaServiceStub extends PesquisaService3 {
                constructor(http: Http) {
                    super(http);
                }
                getPesquisa(pesquisaId) {
                    return pesquisaId === pesquisa.id ? Observable.of(pesquisa) : Observable.of(null);
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
                        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions)
                    }
                ]
            })
        });

        it('deve ser instanciado',
            inject([IndicadorService3, MockBackend],
                (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    expect(indicadorService).toBeDefined();
                })
        )

        describe('com escopo filhos e sem Pesquisa', () => {

            it('deve retornar 3 indicadores', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[1] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[2] instanceof Indicador).toBeTruthy()
                    })
            ))

            it('os indicadores não devem ter filhos listados', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0].indicadores.length).toBe(0)
                        expect(serviceResponse[1].indicadores.length).toBe(0)
                        expect(serviceResponse[2].indicadores.length).toBe(0)
                    })
            ))

            it('os indicadores devem ter a id da pesquisa a qual pertencem', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0].pesquisaId).toBe(pesquisa.id)
                        expect(serviceResponse[1].pesquisaId).toBe(pesquisa.id)
                        expect(serviceResponse[2].pesquisaId).toBe(pesquisa.id)
                    })
            ))

            it('os indicadores não devem possuir a propriedade pesquisa', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse[0].pesquisa).toBeUndefined()
                        expect(serviceResponse[0].hasOwnProperty('pesquisa')).toBe(false)
                        expect(serviceResponse[1].pesquisa).toBeUndefined()
                        expect(serviceResponse[1].hasOwnProperty('pesquisa')).toBe(false)
                        expect(serviceResponse[2].pesquisa).toBeUndefined()
                        expect(serviceResponse[2].hasOwnProperty('pesquisa')).toBe(false)
                    })
            ))

            it('retorna erro caso não haja pesquisa com a id solicitada', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 200 }));
                        const pesquisaId = 130;
                        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: one]`;

                        mockBackend.connections.subscribe(c => connection = c);
                        indicadorService.getIndicadoresDaPesquisa(pesquisaId).subscribe(() => { }, err => serviceResponse = err);
                        connection.mockRespond(mockResponse);
                        tick();

                        expect(serviceResponse.message).toBe(errorMessage)
                    })
            ));
        })

        describe('com escopo arvoreCompleta e sem Pesquisa', () => {

            it('deve retornar 3 indicadores', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[1] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[2] instanceof Indicador).toBeTruthy()
                    })
            ))

            it('cada indicador deve ter filhos indicadoes', fakeAsync(
                inject([IndicadorService3, MockBackend], (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true }).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(3)
                    expect(serviceResponse[0].indicadores.every(indicador => indicador instanceof Indicador)).toBeTruthy()
                    expect(serviceResponse[1].indicadores.every(indicador => indicador instanceof Indicador)).toBeTruthy()
                    expect(serviceResponse[2].indicadores.every(indicador => indicador instanceof Indicador)).toBeTruthy()
                })
            ))

            it('deve retornar a árvore completa', fakeAsync(
                inject([IndicadorService3, MockBackend], (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true }).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(3)
                    expect(serviceResponse[0].indicadores.length).toBe(4)
                    expect(serviceResponse[0].indicadores[0].indicadores.length).toBe(4)
                    expect(serviceResponse[0].indicadores[0].indicadores[0].indicadores.length).toBe(0)
                })
            ))

            it('os indicadores devem ter a id da pesquisa a qual pertencem', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0].pesquisaId).toBe(pesquisa.id)
                        expect(serviceResponse[1].pesquisaId).toBe(pesquisa.id)
                        expect(serviceResponse[2].pesquisaId).toBe(pesquisa.id)
                    })
            ))

            it('os indicadores não devem possuir a propriedade pesquisa', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse[0].pesquisa).toBeUndefined()
                        expect(serviceResponse[0].hasOwnProperty('pesquisa')).toBe(false)
                        expect(serviceResponse[1].pesquisa).toBeUndefined()
                        expect(serviceResponse[1].hasOwnProperty('pesquisa')).toBe(false)
                        expect(serviceResponse[2].pesquisa).toBeUndefined()
                        expect(serviceResponse[2].hasOwnProperty('pesquisa')).toBe(false)
                    })
            ))

            it('retorna erro caso não haja pesquisa com a id solicitada', fakeAsync(
                inject([IndicadorService3, MockBackend], (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 200 }));
                    const pesquisaId = 130;
                    const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: sub]`;

                    mockBackend.connections.subscribe(c => connection = c);
                    indicadorService.getIndicadoresDaPesquisa(pesquisaId, { arvoreCompleta: true }).subscribe(() => { }, err => serviceResponse = err);
                    connection.mockRespond(mockResponse);
                    tick();

                    expect(serviceResponse.message).toBe(errorMessage)
                })
            ));
        })

        describe('com escopo filhos e com Pesquisa', () => {

            it('deve retornar 3 indicadores', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { comPesquisa: true }).subscribe(indicadores => {
                            serviceResponse = indicadores
                        })
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[1] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[2] instanceof Indicador).toBeTruthy()
                    })
            ))

            it('os indicadores não devem ter filhos listados', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0].indicadores.length).toBe(0)
                        expect(serviceResponse[1].indicadores.length).toBe(0)
                        expect(serviceResponse[2].indicadores.length).toBe(0)
                    })
            ))

            it('os indicadores não devem ter a propriedade pesquisaId', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse[0].pesquisaId).toBeUndefined()
                        expect(serviceResponse[0].hasOwnProperty('pesquisaId')).toBeFalsy()
                        expect(serviceResponse[1].pesquisaId).toBeUndefined()
                        expect(serviceResponse[1].hasOwnProperty('pesquisaId')).toBeFalsy()
                        expect(serviceResponse[2].pesquisaId).toBeUndefined()
                        expect(serviceResponse[2].hasOwnProperty('pesquisaId')).toBeFalsy()
                    })
            ))

            it('os indicadores devem ter a propriedade pesquisa igual ao objeto Pesquisa', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse[0].pesquisa).toBe(pesquisa)
                        expect(serviceResponse[1].pesquisa).toBe(pesquisa)
                        expect(serviceResponse[2].pesquisa).toBe(pesquisa)
                    })
            ))

            it('retorna erro caso não haja pesquisa com a id solicitada', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serviceResponse, connection;

                        const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 200 }));
                        const pesquisaId = 130;
                        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: one]`;

                        mockBackend.connections.subscribe(c => connection = c);
                        indicadorService.getIndicadoresDaPesquisa(pesquisaId, { comPesquisa: true }).subscribe(() => { }, err => serviceResponse = err);
                        connection.mockRespond(mockResponse);
                        tick();

                        expect(serviceResponse.message).toBe(errorMessage)
                    })
            ));
        })

        describe('com escopo arvoreCompleta e com Pesquisa', () => {

            it('deve retornar 3 indicadores', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true, comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(3)
                        expect(serviceResponse[0] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[1] instanceof Indicador).toBeTruthy()
                        expect(serviceResponse[2] instanceof Indicador).toBeTruthy()
                    })
            ))

            it('cada indicador deve ter filhos indicadores', fakeAsync(
                inject([IndicadorService3, MockBackend], (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true, comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(3)
                    expect(serviceResponse[0].indicadores.every(indicador => indicador instanceof Indicador)).toBeTruthy()
                    expect(serviceResponse[1].indicadores.every(indicador => indicador instanceof Indicador)).toBeTruthy()
                    expect(serviceResponse[2].indicadores.every(indicador => indicador instanceof Indicador)).toBeTruthy()
                })
            ))

            it('deve retornar a árvore completa', fakeAsync(
                inject([IndicadorService3, MockBackend], (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    mockBackend.connections.subscribe(c => {
                        connection = c;
                        serverResponse = mockResponse[c.request.url];
                    });
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true, comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                    connection.mockRespond(serverResponse);
                    tick();

                    expect(serviceResponse.length).toBe(3)
                    expect(serviceResponse[0].indicadores.length).toBe(4)
                    expect(serviceResponse[0].indicadores[0].indicadores.length).toBe(4)
                    expect(serviceResponse[0].indicadores[0].indicadores[0].indicadores.length).toBe(0)
                })
            ))

            it('os indicadores não devem ter a propriedade pesquisaId', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true, comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse[0].pesquisaId).toBeUndefined()
                        expect(serviceResponse[0].hasOwnProperty('pesquisaId')).toBeFalsy()
                        expect(serviceResponse[1].pesquisaId).toBeUndefined()
                        expect(serviceResponse[1].hasOwnProperty('pesquisaId')).toBeFalsy()
                        expect(serviceResponse[2].pesquisaId).toBeUndefined()
                        expect(serviceResponse[2].hasOwnProperty('pesquisaId')).toBeFalsy()
                    })
            ))

            it('os indicadores devem ter a propriedade pesquisa igual ao objeto Pesquisa', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, { arvoreCompleta: true, comPesquisa: true }).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse[0].pesquisa).toBe(pesquisa)
                        expect(serviceResponse[1].pesquisa).toBe(pesquisa)
                        expect(serviceResponse[2].pesquisa).toBe(pesquisa)
                    })
            ))

            it('retorna erro caso não haja pesquisa com a id solicitada', fakeAsync(
                inject([IndicadorService3, MockBackend], (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 200 }));
                    const pesquisaId = 130;
                    const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}, escopo: sub]`;

                    mockBackend.connections.subscribe(c => connection = c);
                    indicadorService.getIndicadoresDaPesquisa(pesquisaId, { arvoreCompleta: true, comPesquisa: true }).subscribe(() => { }, err => serviceResponse = err);
                    connection.mockRespond(mockResponse);
                    tick();

                    expect(serviceResponse.message).toBe(errorMessage)
                })
            ));
        })


    })

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
                        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions)
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

        describe('indicadores sem Pesquisa', () => {

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
        })

        describe('indicadores com Pesquisa', () => {
            
            it('deve retornar um array de indicadores', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresById([5905, 5906, 28135, 28136], {comPesquisa: true}).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(4)
                        expect(serviceResponse[0].id).toBe(5905)
                        expect(serviceResponse[1].id).toBe(5906)
                        expect(serviceResponse[2].id).toBe(28135)
                        expect(serviceResponse[3].id).toBe(28136)
                    })
            ));

            it('cada indicador deve conter uma referência de Pesquisa', fakeAsync(
                inject([IndicadorService3, MockBackend],
                    (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                        let serverResponse;

                        mockBackend.connections.subscribe(c => {
                            connection = c;
                            serverResponse = mockResponse[c.request.url];
                        });
                        indicadorService.getIndicadoresById([5905, 5906, 28135, 28136], {comPesquisa: true}).subscribe(indicadores => serviceResponse = indicadores)
                        connection.mockRespond(serverResponse);
                        tick();

                        expect(serviceResponse.length).toBe(4)
                        expect(serviceResponse[0].pesquisa).toBe(pesquisas[13])
                        expect(serviceResponse[1].pesquisa).toBe(pesquisas[13])
                        expect(serviceResponse[2].pesquisa).toBe(pesquisas[21])
                        expect(serviceResponse[3].pesquisa).toBe(pesquisas[21])
                    })
            ));
        })
    })
})