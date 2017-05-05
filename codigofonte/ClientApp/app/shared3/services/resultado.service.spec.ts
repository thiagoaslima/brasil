import 'jest';
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

         it('retorna 2 resultados, um para cada localidade', fakeAsync(
            inject([ResultadoService3, MockBackend], (resultadoService: ResultadoService3, mockBackend: MockBackend) => {
                const resultadoDTO = [
                    {"id":5905,"res":[{"localidade":"330010","res":{"2005":"44","2007":"68","2009":"8","2012":"7","2015":"0"}},{"localidade":"330455","res":{"2005":"959","2007":"615","2009":"394","2012":"203","2015":"191"}}]}
                ]
                mockResponse = new Response(new ResponseOptions({ body: resultadoDTO, status: 200 }));

                mockBackend.connections.subscribe(c => connection = c);
                resultadoService.getResultados(5905, 330455).subscribe(resultados => serviceResponse = resultados)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.length).toBe(2)
                expect(serviceResponse[0] instanceof Resultado).toBeTruthy()
                expect(serviceResponse[1] instanceof Resultado).toBeTruthy()
                expect(serviceResponse[0].indicadorId).toBe(5905);
                expect(serviceResponse[0].localidadeCodigo).toBe(330010);
                expect(serviceResponse[1].indicadorId).toBe(5905);
                expect(serviceResponse[1].localidadeCodigo).toBe(330455);
            })
        ));

        it('retorna 4 resultados, um para cada par indicador-localidade', fakeAsync(
            inject([ResultadoService3, MockBackend], (resultadoService: ResultadoService3, mockBackend: MockBackend) => {
                const resultadoDTO = [
                    {"id":5905,"res":[{"localidade":"330010","res":{"2005":"44","2007":"68","2009":"8","2012":"7","2015":"0"}},{"localidade":"330455","res":{"2005":"959","2007":"615","2009":"394","2012":"203","2015":"191"}}]},{"id":5906,"res":[{"localidade":"330010","res":{"2005":"0","2007":"0","2009":"0","2012":"0","2015":"0"}},{"localidade":"330455","res":{"2005":"228","2007":"88","2009":"74","2012":"240","2015":"344"}}]}
                ]
                mockResponse = new Response(new ResponseOptions({ body: resultadoDTO, status: 200 }));

                mockBackend.connections.subscribe(c => connection = c);
                resultadoService.getResultados(5905, 330455).subscribe(resultados => serviceResponse = resultados)
                connection.mockRespond(mockResponse);
                tick();

                expect(serviceResponse.length).toBe(4)
                expect(serviceResponse.every(obj => obj instanceof Resultado)).toBeTruthy()
                expect(serviceResponse.map(obj => obj.indicadorId)).toEqual([5905, 5905, 5906, 5906]);
                expect(serviceResponse.map(obj => obj.localidadeCodigo)).toEqual([330010, 330455, 330010, 330455]);
            })
        ));
    })
})
