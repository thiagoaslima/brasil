/// <reference types="jest" />
/// <reference path="./jasmine.custom.matcher.d.ts"/>

import { Http,HttpModule,BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Resultado } from '../models';
import { IndicadorService3, PesquisaService3, LocalidadeService3, ResultadoService3,RankingService3} from '.';

import { arrayMatcher} from './jasmine.custom.matcher';

describe('RankingServiceE2E', () => {
    let connection, mockResponse, resultadosDTO, serviceResponse;

    beforeEach(() => {
        connection = null;
        serviceResponse = null;

        TestBed.configureTestingModule({
            imports:[HttpModule],
            providers: [
                {
                    provide: RankingService3,
                    deps: [Http],
                    useFactory: (http) => new RankingService3(http)
                }
            ]
        })
        jasmine.addMatchers(arrayMatcher);
    })
    afterEach(() => {
            //RankingService3.cache.clear();
    })

    describe('Testes no serviço getRankingsIndicador', () => {

       
        it('Testa retorno de rakings relacionado ao indicador passado por parâmetro', (done)=>{
            inject([RankingService3], (rankingService: RankingService3) => {
                
                let idsIndicadores = [ { 
                                            "indicadorId":5905,
                                            "periodo":"0"
                                        }
                                      ];
                let localidade = 330455;
                rankingService.getRankingsIndicador(idsIndicadores,null,localidade).subscribe(resultados => {
    
                    try{
                        expect(resultados).toHaveLength(1);
                        expect(resultados[0] instanceof Resultado).toBeTruthy();
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
                let localidade = 1;//330455;
                resultadoService.getResultadosCartograma(idIndicador,localidade).subscribe(resultados => {
    
                    try{
                        for(var ind in resultados){
                            
                            expect(resultados[ind] instanceof Resultado).toBeTruthy();
                            expect(resultados[ind].indicadorId).toBe(idIndicador)
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
