/// <reference types="jest" />
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Pesquisa } from '../models';
import { niveisTerritoriais } from '../values';

import { PesquisaService3 } from './pesquisa.service';

describe('PesquisaService', () => {
    let connection, mockResponse, serviceResponse;

    const pesquisas = [
        {
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
                    "nota": [],
                    "periodo": "2005",
                    "publicacao": "05/01/2016 14:46:24"
                },
                {
                    "fonte": [
                        "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2007"
                    ],
                    "nota": [],
                    "periodo": "2007",
                    "publicacao": "05/01/2016 14:46:24"
                }
            ]
        },
        {
            "id": 45,
            "nome": "Síntese de Indicadores Sociais",
            "descricao": null,
            "contexto": "1000",
            "observacao": null,
            "periodos": [
                {
                    "fonte": [
                        "IBGE, Pesquisa Nacional por Amostra de Domicílios 2015",
                        "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Projeção da população do Brasil por sexo e idade para o período 2000/2060",
                        "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Projeção da população das Unidades da Federação por sexo e idade para o período 2000/2030",
                        "IBGE, Pesquisa Nacional de Saúde 2013"
                    ],
                    "nota": [],
                    "periodo": "2016",
                    "publicacao": "01/01/2017 00:00:00"
                }
            ]
        },
        {
            "id": 14,
            "nome": "Produção Agrícola Municipal - Lavoura Temporária",
            "descricao": null,
            "contexto": "1010",
            "observacao": null,
            "periodos": [
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2004; Rio de Janeiro: IBGE, 2005"
                    ],
                    "nota": [],
                    "periodo": "2004",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2005; Rio de Janeiro: IBGE, 2006"
                    ],
                    "nota": [],
                    "periodo": "2005",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2006; Rio de Janeiro: IBGE, 2007"
                    ],
                    "nota": [],
                    "periodo": "2006",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2007. Rio de Janeiro: IBGE, 2008"
                    ],
                    "nota": [],
                    "periodo": "2007",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2008. Rio de Janeiro: IBGE, 2009"
                    ],
                    "nota": [],
                    "periodo": "2008",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2009. Rio de Janeiro: IBGE, 2010"
                    ],
                    "nota": [],
                    "periodo": "2009",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2010. Rio de Janeiro: IBGE, 2011"
                    ],
                    "nota": [],
                    "periodo": "2010",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2011. Rio de Janeiro: IBGE, 2012"
                    ],
                    "nota": [],
                    "periodo": "2011",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2012. Rio de Janeiro: IBGE, 2013"
                    ],
                    "nota": [],
                    "periodo": "2012",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2013. Rio de Janeiro: IBGE, 2014"
                    ],
                    "nota": [],
                    "periodo": "2013",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2014. Rio de Janeiro: IBGE, 2015"
                    ],
                    "nota": [],
                    "periodo": "2014",
                    "publicacao": "25/11/2015 16:48:31"
                },
                {
                    "fonte": [
                        "IBGE, Produção Agrícola Municipal 2015. Rio de Janeiro: IBGE, 2016"
                    ],
                    "nota": [],
                    "periodo": "2015",
                    "publicacao": "22/11/2016 14:56:56"
                }
            ]
        }
    ]

    beforeEach(() => {
        connection = null;
        serviceResponse = null;

        mockResponse = new Response(new ResponseOptions({ body: pesquisas, status: 200 }));

        TestBed.configureTestingModule({
            providers: [
                PesquisaService3,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory: (backend, options) => new Http(backend, options)
                }
            ]
        })
    });

    

    describe('getAllPesquisas', () => {

        it('retorna 3 pesquisas', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getAllPesquisas().subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.length).toBe(3)
                expect(serviceResponse[0] instanceof Pesquisa).toBeTruthy()
                expect(serviceResponse[1] instanceof Pesquisa).toBeTruthy()
                expect(serviceResponse[2] instanceof Pesquisa).toBeTruthy()
            })
        ));

        it('retorna as pesquisas de id 13, 45 e 14, respectivamente', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getAllPesquisas().subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse[0].id).toBe(13)
                expect(serviceResponse[1].id).toBe(45)
                expect(serviceResponse[2].id).toBe(14)
            })
        ));

         it('deve retornar Erro caso haja algum problema no servidor', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {              
                const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 500 }));
                const errorMessage = `Não foi possível recuperar as pesquisas`;

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getAllPesquisas().subscribe(() => {}, response => serviceResponse = response)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.message).toBe(errorMessage)
            })
        ))

    })

    describe('getPesquisasPorAbrangenciaTerritorial', () => {

        it('deve responder apenas as pesquisas com determinada abrangência territorial', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisasPorAbrangenciaTerritorial(niveisTerritoriais.municipio.label).subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.length).toBe(2)
                expect(serviceResponse[0].id).toBe(13)
                expect(serviceResponse[1].id).toBe(14)
            })
        ))

        it('deve responder um array vazio caso não haja pesquisas com aquela abrangência', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisasPorAbrangenciaTerritorial(niveisTerritoriais.macrorregiao.label).subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.length).toBe(0)
                expect(serviceResponse).toEqual([])
            })
        ))

        it('deve retornar Erro caso não exista o nivel territorial consultado', 
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {              
                const nivelInexistente = 'nivelInexistente';
                const errorMessage = `Não existe o nível territorial pesquisado. Favor verifique sua solicitação. [nivelterritorial: ${nivelInexistente}]`;

                pesquisaService.getPesquisasPorAbrangenciaTerritorial(nivelInexistente).subscribe(() => {}, response => serviceResponse = response)

                expect(serviceResponse.message).toBe(errorMessage)
            })
        )

    })

    describe('getPesquisas', () => {

        it('retorna 2 pesquisas', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisas([13,14]).subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.length).toBe(2)
                expect(serviceResponse[0] instanceof Pesquisa).toBeTruthy()
                expect(serviceResponse[1] instanceof Pesquisa).toBeTruthy()
            })
        ));

        it('retorna as pesquisas de id 13 e 14, respectivamente', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisas([13,14]).subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse[0].id).toBe(13)
                expect(serviceResponse[1].id).toBe(14)
            })
        ));

         it('deve retornar erro caso haja algum problema no servidor', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {              
                const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 500 }));
                const errorMessage = `Não foi possível recuperar as pesquisas`;

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisas([13,14]).subscribe(() => {}, response => serviceResponse = response)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.message).toBe(errorMessage)
            })
        ))

    })

    describe('getPesquisa', () => {

        it('retorna a pesquisa com o valor de id passado para a função', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                const mockResponse = new Response(new ResponseOptions({ body: pesquisas[0], status: 200 }));

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisa(13).subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse instanceof Pesquisa).toBeTruthy()
                expect(serviceResponse.id).toBe(13)
            })
        ));

        it('retorna erro caso não haja pesquisa com a id solicitada', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 500 }));
                const pesquisaId = 130;
                const errorMessage = `Não foi possível recuperar a pesquisa solicitada. Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]`;

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisa(pesquisaId).subscribe(() => { }, err => serviceResponse = err);
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.message).toBe(errorMessage)
            })
        ));
    })

})
