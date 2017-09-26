/// <reference types="jest" />
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Resultado } from '../models';
import { IndicadorService3, PesquisaService3, LocalidadeService3, ResultadoService3 } from '.';

describe('ResultadoServiceE2E', () => {
    let connection, mockResponse, resultadosDTO, serviceResponse;

    class PesquisaServiceStub extends PesquisaService3 {
        constructor(http: Http) {
            super(http);
        }
    }

    class IndicadorServiceStub extends IndicadorService3 {
        constructor(http: Http, pesquisaService: PesquisaService3) {
            super(http, pesquisaService);
        }
    }

    beforeEach(() => {
        connection = null;
        serviceResponse = null;

        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                {
                    provide: PesquisaService3,
                    deps: [Http],
                    useFactory: (http) => new PesquisaServiceStub(http)
                },
                {
                    provide: IndicadorService3,
                    deps: [Http, PesquisaService3],
                    useFactory: (http, pesquisaService) => new IndicadorServiceStub(http, pesquisaService)
                },
                {
                    provide: LocalidadeService3,
                    deps: [Http, PesquisaService3],
                    useFactory: (http, localidadeService) => new LocalidadeService3(http)
                },
                {
                    provide: ResultadoService3,
                    deps: [Http, IndicadorService3, LocalidadeService3],
                    useFactory: (http, indicadorService, localidadeService) => new ResultadoService3(http, indicadorService, localidadeService)
                }
            ]
        })
    })
    afterEach(() => {
        ResultadoService3.cache.clear();
    })

    describe('getResultados', () => {

        it('retorna 1 resultado', (done) => {
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {

                resultadoService.getResultados(5905, 330455).subscribe(resultados => {
                    serviceResponse = resultados;
                    try {
                        expect(serviceResponse.length).toBe(1);
                        expect(serviceResponse[0] instanceof Resultado).toBeTruthy();
                    } catch (e) {
                        fail(e);
                    }
                    done();
                });

            })();
        });

        it('retorna 2 resultados, um para cada localidade', (done) => {
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {
                resultadoService.getResultados(5905, 330455).subscribe(resultados => {
                    serviceResponse = resultados;
                    try {
                        expect(serviceResponse.length).toBe(1)
                        expect(serviceResponse[0] instanceof Resultado).toBeTruthy()
                        expect(serviceResponse[0].indicadorId).toBe(5905);
                        expect(serviceResponse[0].codigoLocalidade).toBe(330010);
                        expect(serviceResponse[1].indicadorId).toBe(5905);
                        expect(serviceResponse[1].codigoLocalidade).toBe(330455);
                    } catch (e) {
                        fail(e);
                    }
                    done();

                });

            })();
        });

        it('retorna 4 resultados, um para cada par indicador-localidade', (done) => {
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {

                resultadoService.getResultados(5905, 330455).subscribe(resultados => {
                    serviceResponse = resultados;
                    try {
                        expect(serviceResponse.length).toBe(4)
                        expect(serviceResponse.every(obj => obj instanceof Resultado)).toBeTruthy()
                        expect(serviceResponse.map(obj => obj.indicadorId)).toEqual([5905, 5905, 5906, 5906]);
                        expect(serviceResponse.map(obj => obj.codigoLocalidade)).toEqual([330010, 330455, 330010, 330455]);
                    } catch (e) {
                        fail(e);
                    }
                    done();
                });

            })();
        });
    })
})
