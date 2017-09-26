/// <reference types="jest" />
import { Http,HttpModule,BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync,async, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Indicador, Pesquisa } from '../models';
import { IndicadorService3, PesquisaService3 } from './';
import { BasicLRUCache } from '../../cache/model';
import { ServicoDados as servidor } from '../values'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('IndicadorServiceE2E', () => {
    let connection, mockResponse, serviceResponse, serverResponse;
    let indicadorService: IndicadorService3;

    let pesquisas;

    beforeEach(() => {
        TestBed.resetTestingModule();


        serverResponse = null;
        serviceResponse = null;
        connection = null;

        class PesquisaServiceStub extends PesquisaService3 {
            constructor(http: Http) {
                super(http);
            }

            getPesquisas(ids) {
                return Observable.of(ids.map(id => pesquisas[id]));
            }
        }


        TestBed.configureTestingModule({
            imports:[HttpModule],
            providers: [
                {
                    provide: PesquisaService3,
                    deps: [Http],
                    useFactory: (http) => new PesquisaServiceStub(http)
                },
                {
                    provide: IndicadorService3,
                    deps: [Http, PesquisaService3],
                    useFactory: (http, pesquisaService) => new IndicadorService3(http, pesquisaService)
                },
               
            
            ]

        })
    })


    afterEach(() => {
        IndicadorService3.cache.clear();
    })
    describe('testar indicadores', () => {
        
        it('deve ser instanciado',
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                   
                    expect(indicadorService).toBeDefined();
                })
        )
   

        it('deve retornar um array de indicadores', (done) => {
            (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    
                     let serverResponse;

                     indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores =>{
                         
                        serviceResponse = indicadores;

                        try {
                            expect(serviceResponse.length).toBe(5);
                            expect(serviceResponse[0].id).toBe(5905);
                            expect(serviceResponse[1].id).toBe(5906);
                            expect(serviceResponse[2].id).toBe(28135);
                            expect(serviceResponse[3].id).toBe(28136);

                        } catch (e) {
                            fail(e);
                        }
                        done();

                    })

                })
            )();
        });
    

        it('cada indicador deve conter o id da pesquisa a qual pertence na propriedade "pesquisaId"', (done) => {
             (inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {

                    let serverResponse;

                    indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores => {
                        serviceResponse = indicadores;
                        try{
                            
                            expect(serviceResponse.length).toBe(4);
                            expect(serviceResponse[0].pesquisaId).toBe(13);
                            expect(serviceResponse[1].pesquisaId).toBe(13);
                            expect(serviceResponse[2].pesquisaId).toBe(21);
                            expect(serviceResponse[3].pesquisaId).toBe(21);
                        }catch(e){
                            fail(e);
                        }
                        done();
                    })
                    
                }))();
            }
        )
   

        it('ignora id inexistente de indicador', (done)=>{
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    let serverResponse;

                    indicadorService.getIndicadoresById([999999]).subscribe(indicadores => {
                        serviceResponse = indicadores;
                        try{

                            expect(serviceResponse.length).toBe(0);
                            expect(serviceResponse[0]).toBeUndefined();

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
                    indicadorService.getIndicadoresById([]).subscribe(() => { }, err =>{
                        serviceResponse = err.message;
                        try{
                            expect(serviceResponse).toBe('Não foi possível retornar indicadores para os parâmetros informados. [id: nenhum valor informado]');
                        }catch(e){
                            
                            fail(e);
                        }
                        done();
                    } )
                   
                })();
        })
     })

     describe('passando código de localidade', () => {
            it('deve construir instancias de Indicador com Resultado', (done)=>{
                inject([IndicadorService3],
                    (indicadorService: IndicadorService3) => {
                        let serverResponse;

                        indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores => {
                            serviceResponse = indicadores;
                            try{

                                expect(serviceResponse.length).toBe(4)
                                expect(serviceResponse[0].resultados).toBeDefined();
                                expect(serviceResponse[1].resultados).toBeDefined();
                                expect(serviceResponse[2].resultados).toBeDefined();
                                expect(serviceResponse[3].resultados).toBeDefined();

                            }catch(e){
                                fail(e);
                            }
                            done();
                        })
                       
                        
                 })();
                })

    })
    
    describe('getIndicadoresComPesquisaById', () => {
        
        let pesquisas;
        
        it('deve ser instanciado',
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    try{
                         expect(indicadorService).toBeDefined();
                    }catch(e){
                         fail(e); 
                    }   
                   
                })
        )

        it('deve retornar um array de indicadores', (done)=>{
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    let serverResponse;

                    indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores =>{
                        serviceResponse = indicadores;
                        try{
                            
                            expect(serviceResponse.length).toBe(4)
                            expect(serviceResponse[0].id).toBe(5905)
                            expect(serviceResponse[1].id).toBe(5906)
                            expect(serviceResponse[2].id).toBe(28135)
                            expect(serviceResponse[3].id).toBe(28136)
                        }catch(e){
                            fail(e);
                        }
                        done();

                    } )   
                })()
        });

        it('cada indicador deve conter o objecto da pesquisa a qual pertence na propriedade "pesquisa"', (done)=>{
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    let serverResponse;

                    indicadorService.getIndicadoresById([5905, 5906, 28135, 28136]).subscribe(indicadores =>{

                            serviceResponse = indicadores;
                            try{
                                    expect(serviceResponse.length).toBe(4);
                                    expect(serviceResponse[0].pesquisa).toBe(pesquisas[0]);
                                    expect(serviceResponse[1].pesquisa).toBe(pesquisas[0]);
                                    expect(serviceResponse[2].pesquisa).toBe(pesquisas[1]);
                                    expect(serviceResponse[3].pesquisa).toBe(pesquisas[1]);

                            }catch(e){
                                fail(e);
                            }
                            done();

                    } )
            
                    
                })();
        })

        it('ignora id inexistente de indicador', (done)=>{
            inject([IndicadorService3],
                (indicadorService: IndicadorService3) => {
                    let serverResponse;

                    indicadorService.getIndicadoresById([999999]).subscribe(indicadores => {
                        serviceResponse = indicadores;
                        try{
                            expect(serviceResponse.length).toBe(0);
                            expect(serviceResponse[0]).toBeUndefined();
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

                   
                    indicadorService.getIndicadoresById([]).subscribe(() => { }, err => {
                        serviceResponse = err.message;
                        try{
                            expect(serviceResponse).toBe('Não foi possível retornar indicadores para os parâmetros informados. [id: nenhum valor informado]');
                        }catch(e){
                            fail(e);
                        }
                        done();
                    })
    
                    
                })();
        })
    })
    

})


