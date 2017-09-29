/// <reference types="jest" />
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions, } from '@angular/http';
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { BasicLRUCache } from '../../cache/model'
import { CacheFactory } from '../../cache/cacheFactory.service';
import { Pesquisa } from '../models';
import { niveisTerritoriais } from '../values';

import { PesquisaService3 } from './pesquisa.service';

describe('PesquisaServiceE2E', () => {
    let connection, mockResponse, serviceResponse;
    let mockBackend: MockBackend;
    let pesquisaService: PesquisaService3;


    beforeEach(() => {

        connection = null;
        serviceResponse = null;

        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                {
                    provide: PesquisaService3,
                    deps: [Http],
                    useFactory: (http) => new PesquisaService3(http)
                }
            ]

        })

    });

    afterEach(() => {
        PesquisaService3.cache.clear();
    });


    describe('getAllPesquisas', () => {

        it('retorna 3 pesquisas', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    pesquisaService.getAllPesquisas().subscribe(pesquisas => {

                        serviceResponse = pesquisas;
                        try {
                            expect(serviceResponse.length).toBe(3);
                            expect(serviceResponse[0] instanceof Pesquisa).toBeTruthy();
                            expect(serviceResponse[1] instanceof Pesquisa).toBeTruthy();
                            expect(serviceResponse[2] instanceof Pesquisa).toBeTruthy();

                        } catch (e) {
                            fail(e);
                        }
                        done();
                    })

                })();

        });

        it('retorna as pesquisas de id 13, 45 e 14, respectivamente', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    pesquisaService.getAllPesquisas().subscribe(pesquisas => {

                        serviceResponse = pesquisas;
                        try {

                            expect(serviceResponse[0].id).toBe(13);
                            expect(serviceResponse[1].id).toBe(45);
                            expect(serviceResponse[2].id).toBe(14);

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    })

                })();
        });

        it('deve retornar Erro caso haja algum problema no servidor', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    const errorMessage = `Não foi possível recuperar as pesquisas`;
                    pesquisaService.getAllPesquisas().subscribe(response => {

                        serviceResponse = response;
                        try {
                            expect(serviceResponse.message).toBe(errorMessage);
                        } catch (e) {
                            fail(e);
                        }
                        done();

                    })

                })();

        })
    })

    describe('getPesquisasPorAbrangenciaTerritorial', () => {

        it('deve responder apenas as pesquisas com determinada abrangência territorial', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    pesquisaService.getPesquisasPorAbrangenciaTerritorial(niveisTerritoriais.municipio.label).subscribe(pesquisas => {

                        serviceResponse = pesquisas;
                        try {
                            expect(serviceResponse.length).toBe(2);
                            expect(serviceResponse[0].id).toBe(13);
                            expect(serviceResponse[1].id).toBe(14);
                        } catch (e) {

                            fail(e);
                        }
                        done();
                    })
                })();
        })

        it('deve responder um array vazio caso não haja pesquisas com aquela abrangência', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    pesquisaService.getPesquisasPorAbrangenciaTerritorial(niveisTerritoriais.macrorregiao.label).subscribe(pesquisas => {

                        serviceResponse = pesquisas;
                        try {
                            expect(serviceResponse.length).toBe(0);
                            expect(serviceResponse).toEqual([]);
                        } catch (e) {
                            fail(e);
                        }
                        done();
                    })

                })();
        })

        it('deve retornar Erro caso não exista o nivel territorial consultado', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {
                    const nivelInexistente = 'nivelInexistente';
                    const errorMessage = `Não existe o nível territorial pesquisado. Favor verifique sua solicitação. [nivelterritorial: ${nivelInexistente}]`;

                    pesquisaService.getPesquisasPorAbrangenciaTerritorial(nivelInexistente).subscribe(response => {
                        serviceResponse = response;
                        try {
                            expect(serviceResponse.message).toBe(errorMessage);
                        } catch (e) {
                            fail(e);
                        }

                    })


                })();
        })

    })

    describe('getPesquisas', () => {

        it('retorna 2 pesquisas', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    pesquisaService.getPesquisas([13, 14]).subscribe(pesquisas => {
                        serviceResponse = pesquisas;
                        try {

                            expect(serviceResponse.length).toBe(2);
                            expect(serviceResponse[0] instanceof Pesquisa).toBeTruthy();
                            expect(serviceResponse[1] instanceof Pesquisa).toBeTruthy();

                        } catch (e) {
                            fail(e);
                        }
                        done();
                    })


                })();
        });

        it('retorna as pesquisas de id 13 e 14, respectivamente', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    pesquisaService.getPesquisas([13, 14]).subscribe(pesquisas => {
                        serviceResponse = pesquisas;
                        try {

                            expect(serviceResponse[0].id).toBe(13);
                            expect(serviceResponse[1].id).toBe(14);
                        } catch (e) {

                            fail(e);
                        }
                        done();
                    })
                })();
        });

        it('deve retornar erro caso haja algum problema no servidor', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    const errorMessage = `Não foi possível recuperar as pesquisas`;

                    pesquisaService.getPesquisas([13, 14]).subscribe(response => {

                        serviceResponse = response;
                        try {
                            expect(serviceResponse.message).toBe(errorMessage);
                        } catch (e) {
                            fail(e);
                        }
                        done();
                    })
                })();

        })
    })
    describe('getPesquisa', () => {

        /*it('retorna a pesquisa com o valor de id passado para a função', fakeAsync(
            inject([PesquisaService3, MockBackend], (pesquisaService: PesquisaService3, mockBackend: MockBackend) => {

                const mockResponse = new Response(new ResponseOptions({ body: pesquisas[0], status: 200 }));
                
                mockBackend.connections.subscribe(c => connection = c);
               
                pesquisaService.getPesquisa(13).subscribe(pesquisas => serviceResponse = pesquisas)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse instanceof Pesquisa).toBeTruthy()
                expect(serviceResponse.id).toBe(13)
            })
        ));*/

        it('retorna erro caso não haja pesquisa com a id solicitada', (done) => {
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                    const pesquisaId = 130;
                    const errorMessage = `Não foi possível recuperar a pesquisa solicitada. Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]`;

                    pesquisaService.getPesquisa(pesquisaId).subscribe(() => { }, err => {

                        serviceResponse = err;
                        try {
                            expect(serviceResponse.message).toBe(errorMessage);
                        } catch (e) {
                            fail(e);
                        }
                        done();
                    });

                })();
        });

    })

})
