/// <reference types="jest" />
/// <reference path="../jest.custom.matcher.d.ts"/>

import { Http,HttpModule,BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync,async, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Indicador, Pesquisa } from '../models';
import { IndicadorService3, PesquisaService3 } from './';
import { BasicLRUCache } from '../../cache/model';
import { ServicoDados as servidor } from '../values';
import { arrayMatcher} from './jest.custom.matcher';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {TraducaoService}  from '../../traducao/traducao.service';

describe('IndicadorServiceE2E', () => {
    let connection, mockResponse, serviceResponse, serverResponse;
    let indicadorService: IndicadorService3;

    let pesquisas;
    let propriedadesIndicador = ['id','nome','posicao','classe','pesquisaId','unidade','notas'];

    beforeEach(() => {
        TestBed.resetTestingModule();


        serverResponse = null;
        serviceResponse = null;
        connection = null;

        jest.addMatchers(arrayMatcher);
        TestBed.configureTestingModule({
            imports:[HttpModule],
            providers: [
                {
                        provide: TraducaoService,
                        useFactory: () => new  TraducaoService()
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
            
            ]

        })
        
    })
    
    afterEach(() => {
        IndicadorService3.cache.clear();
    })
    describe('validando instância do serviço de indicadores', () => {
        it('deve ser instanciado',
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                   
                    expect(indicadorService).toBeDefined();
                })
        )
    })
    describe('testar serviço getIndicadoresById com indicadores válidos', () => {
        
        it('deve retornar um  indicador válido', (done) => {
            (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    
                        let serverResponse;
                        indicadorService.getIndicadoresById([5905]).subscribe(indicadores =>{
                        
                        try {
                            
                           
                            expect(indicadores).toHaveLength(1);
                            let indicador = indicadores[0];
                            expect(indicador instanceof Indicador).toBeTruthy();
                            var actualProps = Object.keys(indicador);
                            expect(indicador).contemPropriedades(propriedadesIndicador);
                            
                            expect(indicador.id).toBe(5905);

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    })

                })
            )();
        });
        
        it('deve retornar um array de indicadores válidos', (done) => {
            (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    
                     let serverResponse;
                     let idsTesteIndicador = [5905, 5906, 28135, 28136];
                     indicadorService.getIndicadoresById(idsTesteIndicador).subscribe(indicadores =>{
                     try {
                            expect(indicadores).toHaveLength(4);
                            for(let i=0;i<indicadores.length;i++){

                                let indicador = indicadores[i];
                                expect(indicador instanceof Indicador).toBeTruthy();
                                expect(indicador).contemPropriedades(propriedadesIndicador);
                                expect(indicador.id).toBe(idsTesteIndicador[i]);

                            }

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    })

                })
            )();
        });
        it('deve retornar um array de indicadores válidos passando localidade como parâmetro', (done)=>{
                inject([IndicadorService3],
                    (indicadorService: IndicadorService3) => {
                        
                        let idsTesteIndicador = [5905, 5906, 28135, 28136];
                        let localidades = [330010,330455];
                        indicadorService.getIndicadoresById(idsTesteIndicador,localidades).subscribe(indicadores => {
                
                            try{

                                expect(indicadores).toHaveLength(4);
                                for(let i=0;i<indicadores.length;i++){
                                    
                                    let indicador = indicadores[i];
                                    expect(indicador instanceof Indicador).toBeTruthy();
                                    expect(indicador).contemPropriedades(propriedadesIndicador);
                                    expect(indicador).contemPropriedades(['resultados']);
                                    expect(indicador.id).toBe(idsTesteIndicador[i]);
                                    
                                }

                            }catch(e){
                                fail(e);
                            }
                            done();
                        })       
                 })();
            })
        })
        describe('testar serviço getIndicadoresById para tratamento de exceções', () => {
        
                 it('ignora id inexistente de indicador', (done)=>{
                    inject([IndicadorService3],
                        (indicadorService: IndicadorService3) => {
                            let serverResponse;

                            indicadorService.getIndicadoresById([999999],[1]).subscribe(indicadores => {
                               
                                try{

                                    expect(indicadores).toHaveLength(0);
                                    expect(indicadores[0]).toBeUndefined();

                                }catch(e){
                                    fail(e);
                                }
                                done();
                            })
                            
                        })();
                })
                it('retorna erro caso não seja informado id ou seja passado um valor de id inválido', (done)=>{
                    inject([IndicadorService3],
                        (indicadorService: IndicadorService3) => {
                            let serverResponse;

                            indicadorService.getIndicadoresById([1.2],[]).subscribe((indicadores) => { 
                                    
                                    
                                    try{
                                        expect(indicadores).toHaveLength(0);
                                    }catch(e){
                                       fail(e);
                                       
                                    }
                                    done(); 
                                    
                                
                                }, err => {
                                
                               
                                serviceResponse = err.message;
                                try{

                                    expect(serviceResponse).toContain('Não foi possível retornar indicadores para os parâmetros informados');
                                }catch(e){
                                    fail(e);
                                }
                                done();
                            })
                             
                            
                        })();
                })
        })
        
      describe('Testes para o serviço getIndicadoresComPesquisaById passando ids de indicadores válidos', () => {
        
          it('deve retornar um  indicador válido', (done) => {
            (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    
                     let serverResponse;
                     indicadorService.getIndicadoresComPesquisaById([5905]).subscribe(indicadores =>{
                       
                        try {
                            
                            expect(indicadores).toHaveLength(1);
                            let indicador = indicadores[0];
                            expect(indicador instanceof Indicador).toBeTruthy();
                            var actualProps = Object.keys(indicador);
                            //expect(indicador).contemPropriedades(propriedadesIndicador);
                            
                            expect(indicador.id).toBe(5905);

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    },(err)=>{
                        
                        fail(err);
                        done();
                    })

                })
            )();
        });
        
        it('deve retornar um array de indicadores válidos', (done) => {
            (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    
                     let serverResponse;
                     let idsTesteIndicador = [5905, 5906, 28135, 28136];
                     indicadorService.getIndicadoresComPesquisaById(idsTesteIndicador).subscribe(indicadores =>{
                     try {
                            expect(indicadores).toHaveLength(4);
                            for(let i=0;i<indicadores.length;i++){

                                let indicador = indicadores[i];
                                expect(indicador instanceof Indicador).toBeTruthy();
                                //expect(indicador).contemPropriedades(propriedadesIndicador);
                                expect(indicador.id).toBe(idsTesteIndicador[i]);

                            }

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    },(err)=>{
                        
                        fail(err);
                        done();
                    })

                })
            )();
        });
        it('deve retornar um array de indicadores válidos passando localidade como parâmetro', (done)=>{
                inject([IndicadorService3],
                    (indicadorService: IndicadorService3) => {
                        
                        let idsTesteIndicador = [5905, 5906, 28135, 28136];
                        let localidades = [330010,330455];
                        indicadorService.getIndicadoresComPesquisaById(idsTesteIndicador,localidades).subscribe(indicadores => {
                
                            try{

                                expect(indicadores).toHaveLength(4);
                                for(let i=0;i<indicadores.length;i++){
                                    
                                    let indicador = indicadores[i];
                                    expect(indicador instanceof Indicador).toBeTruthy();
                                    //expect(indicador).contemPropriedades(propriedadesIndicador);
                                    //expect(indicador).contemPropriedades(['resultados']);
                                    expect(indicador.id).toBe(idsTesteIndicador[i]);
                                    
                                }

                            }catch(e){
                                fail(e);
                            }
                            done();
                        },
                        (err)=>{
                            fail(err);
                            done();
                        })       
                 })();
            })
    })
    
    
    describe('Testes para o serviço getIndicadoresFilhosByPosicao', () => {
        
        let idPesquisa = 13;
        let posicao = "0";
        it('deve ser instanciado',
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                   
                    expect(indicadorService).toBeDefined();
                })
        )
        
        it('deve retornar um array de indicadores válidos por pesquisa e posição', (done) => {
            (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                  
                     indicadorService.getIndicadoresFilhosByPosicao(idPesquisa,posicao).subscribe(indicadores =>{
                     try {
                            for(let i=0;i<indicadores.length;i++){

                                let indicador = indicadores[i];
                                expect(indicador instanceof Indicador).toBeTruthy();
                                expect(indicador).contemPropriedades(propriedadesIndicador);
                                expect(indicador.pesquisaId).toBe(idPesquisa);

                            }

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    },(err)=>{
                        
                        fail(err);
                        done();
                    })

                })
            )();
        });
        it('deve retornar um array de indicadores válidos por pesquisa e posição passando localidade como parâmetro', (done)=>{
                inject([IndicadorService3],
                    (indicadorService: IndicadorService3) => {
                      
                        let localidades = [330010,330455]
                        indicadorService.getIndicadoresFilhosByPosicao(idPesquisa,posicao,localidades).subscribe(indicadores => {
                
                            try{

                                for(let i=0;i<indicadores.length;i++){
                                    
                                    let indicador = indicadores[i];
                                    expect(indicador instanceof Indicador).toBeTruthy();
                                    expect(indicador).contemPropriedades(propriedadesIndicador);
                                    expect(indicador.pesquisaId).toBe(idPesquisa);
                                    
                                }

                            }catch(e){
                                fail(e);
                            }
                            done();
                        },
                        (err)=>{
                            fail(err);
                            done();
                        })       
                 })();
            })

    })
    
    describe('Testes para o serviço getIndicadoresDaPesquisa', () => {
        
        let idPesquisa = 13;
        let localidades = [330010,330455];
        
        it('deve retornar um array de indicadores válidos', (done) => {
            (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    
                     indicadorService.getIndicadoresDaPesquisa(idPesquisa).subscribe(indicadores =>{
                     try {
                            
                            for(let i=0;i<indicadores.length;i++){

                                let indicador = indicadores[i];
                                expect(indicador instanceof Indicador).toBeTruthy();
                                expect(indicador).contemPropriedades(propriedadesIndicador);
                                expect(indicador.pesquisaId).toBe(idPesquisa);

                            }

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    },(err)=>{
                        
                        fail(err);
                        done();
                    })

                })
            )();
        });
        it('deve retornar um array de indicadores válidos passando localidade como parâmetro', (done)=>{
                inject([IndicadorService3],
                    (indicadorService: IndicadorService3) => {
                        
                        indicadorService.getIndicadoresDaPesquisa(idPesquisa,localidades).subscribe(indicadores => {
                
                            try{

                                for(let i=0;i<indicadores.length;i++){
                                    
                                    let indicador = indicadores[i];
                                    expect(indicador instanceof Indicador).toBeTruthy();
                                    expect(indicador).contemPropriedades(propriedadesIndicador);
                                    expect(indicador.pesquisaId).toBe(idPesquisa);
                                    
                                }

                            }catch(e){
                                fail(e);
                            }
                            done();
                        },
                        (err)=>{
                            fail(err);
                            done();
                        })       
                 })();
            })

    })


})


