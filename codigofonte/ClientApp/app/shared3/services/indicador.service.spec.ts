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
            [servidor.setUrl('pesquisas/13/periodos/all/indicadores')]: new Response(new ResponseOptions({ body: indicadores_arvoreCompleta, status: 200 })),
            [servidor.setUrl('pesquisas/13/periodos/all/indicadores/0?scope=one')]: new Response(new ResponseOptions({ body: indicadores, status: 200 })),
        };

        serverResponse = null;
        serviceResponse = null;
        connection = null;

        const PesquisaServiceStub = {
            getPesquisa(pesquisaId) {
                return pesquisaId === pesquisa.id ? Observable.of(pesquisa) : Observable.of(null);
            }
        }


        TestBed.configureTestingModule({
            providers: [
                {
                    provide: IndicadorService3,
                    deps: [Http],
                    useFactory: (http) => new IndicadorService3(http, PesquisaServiceStub)
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


    describe('getIndicadoresdaPesquisa()', () => {

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
                        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}]`;

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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, true).subscribe(indicadores => serviceResponse = indicadores)
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
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, true).subscribe(indicadores => serviceResponse = indicadores)
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
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, true).subscribe(indicadores => serviceResponse = indicadores)
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
                inject([IndicadorService3, MockBackend], (indicadorService: IndicadorService3, mockBackend: MockBackend) => {
                    const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 200 }));
                    const pesquisaId = 130;
                    const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}]`;

                    mockBackend.connections.subscribe(c => connection = c);
                    indicadorService.getIndicadoresDaPesquisa(pesquisaId, true).subscribe(() => { }, err => serviceResponse = err);
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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, false, true).subscribe(indicadores => {
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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, false, true).subscribe(indicadores => serviceResponse = indicadores)
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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, false, true).subscribe(indicadores => serviceResponse = indicadores)
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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, false, true).subscribe(indicadores => serviceResponse = indicadores)
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
                        const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}]`;

                        mockBackend.connections.subscribe(c => connection = c);
                        indicadorService.getIndicadoresDaPesquisa(pesquisaId, false, true).subscribe(() => { }, err => serviceResponse = err);
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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, true, true).subscribe(indicadores => serviceResponse = indicadores)
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
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, true, true).subscribe(indicadores => serviceResponse = indicadores)
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
                    indicadorService.getIndicadoresDaPesquisa(pesquisa.id, true, true).subscribe(indicadores => serviceResponse = indicadores)
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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, false, true).subscribe(indicadores => serviceResponse = indicadores)
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
                        indicadorService.getIndicadoresDaPesquisa(pesquisa.id, false, true).subscribe(indicadores => serviceResponse = indicadores)
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
                    const errorMessage = `Não foi possível recuperar os indicadores solicitados. [pesquisaId: ${pesquisaId}]`;

                    mockBackend.connections.subscribe(c => connection = c);
                    indicadorService.getIndicadoresDaPesquisa(pesquisaId, true).subscribe(() => { }, err => serviceResponse = err);
                    connection.mockRespond(mockResponse);
                    tick();

                    expect(serviceResponse.message).toBe(errorMessage)
                })
            ));
        })


    })
})