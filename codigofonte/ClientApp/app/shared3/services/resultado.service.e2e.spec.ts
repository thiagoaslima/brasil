/// <reference types="jest" />
/// <reference path="./jest.custom.matcher.d.ts"/>

import { Http,HttpModule,BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Resultado } from '../models';
import { IndicadorService3, PesquisaService3, LocalidadeService3, ResultadoService3 } from '.';

import { arrayMatcher} from './jest.custom.matcher';
import {TraducaoService}  from '../../traducao/traducao.service';

describe('ResultadoServiceE2E', () => {
    let connection, mockResponse, resultadosDTO, serviceResponse;
    let propriedadesResultado = ['indicadorId','codigoLocalidade','periodos','valores'];
    beforeEach(() => {
        connection = null;
        serviceResponse = null;

        TestBed.configureTestingModule({
            imports:[HttpModule],
            providers: [
                {
                        provide: TraducaoService,
                        useFactory: () => new TraducaoService()
                },
                {
                    provide: PesquisaService3,
                    deps: [Http,TraducaoService],
                    useFactory: (http,traducaoService) => new PesquisaService3(http,traducaoService)
                },
                {
                    provide: IndicadorService3,
                    deps: [Http, PesquisaService3,TraducaoService],
                    useFactory: (http, pesquisaService,traducaoService) => new IndicadorService3(http, pesquisaService,traducaoService)
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
        jest.addMatchers(arrayMatcher);
    })
    afterEach(() => {
            ResultadoService3.cache.clear();
    })

    describe('Testes no serviço getResultados', () => {

       
        it('retorna resultados de 1 indicador e 1 código de localidade passados por parâmetro', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {
                
                let idsIndicadores = 5905;
                let localidade = 330455;
                resultadoService.getResultados(idsIndicadores,localidade).subscribe(resultados => {
    
                    try{
                        expect(resultados).toHaveLength(1);
                        
                        expect(resultados[0] instanceof Resultado).toBeTruthy();
                        expect(resultados[0]).contemPropriedades(propriedadesResultado);
                    }catch(e){
                        fail(e);
                    }
                    done();
                },err=>{
                    fail(err);
                    done();
                });
                
            })();
        });

        
        it('retorna resultados de um array de indicadores e 1 código de localidade passados por parâmetro', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {

                let idsIndicadores = [5905, 5906, 28135, 28136];
                let localidade = 330455;
                resultadoService.getResultados(idsIndicadores, localidade).subscribe(resultados => {
                    serviceResponse = resultados;
                    try{
                        expect(resultados).toHaveLength(4);
                        for(let i=0;i<resultados.length;i++){

                                let resultado = resultados[i];
                                expect(resultado instanceof Resultado).toBeTruthy();
                                expect(resultado).contemPropriedades(propriedadesResultado);
                                expect(resultado.indicadorId).toBe(idsIndicadores[i]);
                                expect(resultado.codigoLocalidade).toBe(localidade);
                        }
                
                    }catch(e){
                        fail(e);
                    }
                    done();
           
                },err=>{
                    fail(err);
                    done();
                });
               
            })();
        });

        it('retorna resultados para cada para  arrays de  indicadores e localidades', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {
                
                let idsIndicadores = [5905, 5906, 28135, 28136];
                let localidade =  [330010,330455];
                resultadoService.getResultados(idsIndicadores, localidade).subscribe(resultados => {
                    serviceResponse = resultados;
                    try{
                        for(let i=0;i<resultados.length;i++){

                                let resultado = resultados[i];
                                expect(resultado instanceof Resultado).toBeTruthy();  
                                expect(resultado).contemPropriedades(propriedadesResultado);
                        }
                    }catch(e){
                        fail(e);
                    }
                    done();
                },err=>{
                    fail(err);
                    done();
                });
                
            })();
        });
    })

    describe('Testes no serviço getResultadosCartograma', () => {

        it('retorna resultados de 1 indicador e 1 código de localidade de 1 dígito passados por parâmetro', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {
                
                let idIndicador = 5905;
                let localidade = 13;
                resultadoService.getResultadosCartograma(idIndicador,localidade).subscribe(resultados => {

                    try{
                        
                        for(var ind in resultados){
                            
                            expect(resultados[ind] instanceof Resultado).toBeTruthy();
                            expect(resultados[ind]).contemPropriedades(propriedadesResultado);
                            expect(resultados[ind].indicadorId).toBe(idIndicador);
                        }
                      
                      
                    }catch(e){
                        fail(e);
                    }
                    done();
                },err=>{
                    fail(err);
                    done();
                });
                
            })();
        });
        it('retorna resultados de 1 indicador e 1 código de localidade de 2 dígitos passados por parâmetro', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {
                
                let idIndicador = 5905;
                let localidade = 12;//330455;
                resultadoService.getResultadosCartograma(idIndicador,localidade).subscribe(resultados => {
    
                    try{
                        for(var ind in resultados){
                            
                            expect(resultados[ind] instanceof Resultado).toBeTruthy();
                            expect(resultados[ind]).contemPropriedades(propriedadesResultado);
                            expect(resultados[ind].indicadorId).toBe(idIndicador);
                        }
                      
                    }catch(e){
                        fail(e);
                    }
                    done();
                },err=>{
                    fail(err);
                    done();
                });
                
            })();
        });
    
    })
    describe('Testes no serviço getResultadosCompletos', () => {

        it('retorna resultados de 1 indicador e 1 código de localidade passados por parâmetro', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {
                
                let idsIndicadores = 5905;
                let localidade = 330455;
                resultadoService.getResultadosCompletos(idsIndicadores,localidade).subscribe(resultados => {
    
                    try{
                        expect(resultados).toHaveLength(1);
                        expect(resultados[0] instanceof Resultado).toBeTruthy();
                        expect(resultados[0]).contemPropriedades(propriedadesResultado);
                    }catch(e){
                        fail(e);
                    }
                    done();
                },err=>{
                    fail(err);
                    done();
                });
                
            })();
        });

        
        it('retorna resultados de um array de indicadores e 1 código de localidade passados por parâmetro', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {

                let idsIndicadores = [5905, 5906, 28135, 28136];
                let localidade = 330455;
                resultadoService.getResultadosCompletos(idsIndicadores, localidade).subscribe(resultados => {
                    serviceResponse = resultados;
                    try{
                        expect(resultados).toHaveLength(4);
                        for(let i=0;i<resultados.length;i++){

                                let resultado = resultados[i];
                                expect(resultado instanceof Resultado).toBeTruthy();

                                expect(resultado.indicadorId).toBe(idsIndicadores[i]);
                                expect(resultado.codigoLocalidade).toBe(localidade);
                                expect(resultado).contemPropriedades(propriedadesResultado);
                        }
                
                    }catch(e){
                        fail(e);
                    }
                    done();
           
                },err=>{
                    fail(err);
                    done();
                });
               
            })();
        });

        it('retorna resultados para cada para  arrays de  indicadores e localidades', (done)=>{
            inject([ResultadoService3], (resultadoService: ResultadoService3) => {
                
                let idsIndicadores = [5905, 5906, 28135, 28136];
                let localidade =  [330010,330455];
                resultadoService.getResultadosCompletos(idsIndicadores, localidade).subscribe(resultados => {
                    serviceResponse = resultados;
                    try{
                        for(let i=0;i<resultados.length;i++){

                                let resultado = resultados[i];
                                expect(resultado instanceof Resultado).toBeTruthy();  
                                expect(resultado).contemPropriedades(propriedadesResultado);
                        }
                    }catch(e){
                        fail(e);
                    }
                    done();
                },err=>{
                    fail(err);
                    done();
                });
                
            })();
        });
    })
})
