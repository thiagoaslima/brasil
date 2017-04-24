import { defaultOptions } from 'preboot/__build/src/node/preboot_node';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Pesquisa } from '../models';
import { NiveisTerritoriais } from '../values';

import { PesquisaService3 } from './pesquisa.service';

describe('PesquisaService', () => {


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PesquisaService3,
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
        },

    ]

    describe('getAllPesquisas()', () => {
        const mockResponse = new Response(new ResponseOptions({ body: pesquisas, status: 200 }));
        let serviceResponse, connection;

        it('retorna 2 pesquisas', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getAllPesquisas().then(pesquisas => serviceResponse = pesquisas)
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
                pesquisaService.getAllPesquisas().then(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse[0].id).toBe(13)
                expect(serviceResponse[1].id).toBe(14)
            })
        ));

    })

    describe('getPesquisa', () => {


        it('retorna a pesquisa com o valor de id passado para a função', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                const mockResponse = new Response(new ResponseOptions({ body: pesquisas[0], status: 200 }));
                let serviceResponse, connection;

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisa(13).then(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse instanceof Pesquisa).toBeTruthy()
                expect(serviceResponse.id).toBe(13)
            })
        ));

        it('retorna erro caso não haja pesquisa com a id solicitada', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                const mockResponse = new Response(new ResponseOptions({ body: { "message": "An error has occurred." }, status: 200 }));
                let serviceResponse, connection;
                const pesquisaId = 130;

                mockBackend.connections.subscribe(c => connection = c);
                pesquisaService.getPesquisa(pesquisaId).catch(err => serviceResponse = err);
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse).toBe(`
                        Não foi possível recuperar a pesquisa solicitada. 
                        Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]
                    `)
            })
        ));
    })

})
