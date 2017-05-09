import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Resultado } from '../models';
import { ResultadoService3 } from './resultado.service';

describe('PesquisaService', () => {
    let connection, mockResponse, resultadosDTO, serviceResponse;

    beforeEach(() => {
        connection = null;
        serviceResponse = null;

        TestBed.configureTestingModule({
            providers: [
                ResultadoService3,
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

    describe('getResultados', () => {

        it('retorna 1 resultado', fakeAsync(
            inject([ResultadoService3, MockBackend], (resultadoService: ResultadoService3, mockBackend: MockBackend) => {
                const resultadoDTO = [
                    { "id": 5905, "res": [{ "localidade": "330455", "res": { "2005": "959", "2007": "615", "2009": "394", "2012": "203", "2015": "191" } }] }
                ]
                mockResponse = new Response(new ResponseOptions({ body: resultadoDTO, status: 200 }));

                mockBackend.connections.subscribe(c => connection = c);
                resultadoService.getResultados(5905, 330455).subscribe(resultados => serviceResponse = resultados)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.length).toBe(1)
                expect(serviceResponse[0] instanceof Resultado).toBeTruthy()
            })
        ));
    })
