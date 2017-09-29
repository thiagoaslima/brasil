/// <reference types="jest" />
import { Http,HttpModule, BaseRequestOptions, Response, ResponseOptions, } from '@angular/http';
import { async,fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BrowserDynamicTestingModule,platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

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
    })
    

    describe('Testes no serviço getAllPesquisas',  () => {

        it('retorna todas as pesquisas', (done)=> {
           inject([PesquisaService3],
                (pesquisaService: PesquisaService3) =>  {

                pesquisaService.getAllPesquisas().subscribe(pesquisas =>{

                    try{
                      
                        for(let i=0;i<pesquisas.length;i++){

                                let pesquisa = pesquisas[i];
                                expect(pesquisa instanceof Pesquisa).toBeTruthy();
                        }
                       

                    }catch(e){
                        fail(e);
                    }
                    done();
                } )   
               
           })();
            
        });
        it('deve retornar Erro caso haja algum problema no servidor', (done)=>{
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                const errorMessage = `Não foi possível recuperar as pesquisas`;
                pesquisaService.getAllPesquisas().subscribe(()=>{ done();},err => {

                    serviceResponse = err;
                    try{
                        expect(serviceResponse.message).toBe(errorMessage);
                    }catch(e){
                        fail(e);    
                    }
                    done();

                } )  

            })();   
 
         })
    })
    describe('Testes no serviço getPesquisas',  () => {

        let idsPesquisa = [13,15,45];
        it('Requisição ao serviço getpesquisas com idsPesquisa passado como parâmetro',  (done)=>{
             inject([PesquisaService3],
                (pesquisaService: PesquisaService3) =>  {

                pesquisaService.getPesquisas(idsPesquisa).subscribe(pesquisas =>{

                    try{

                         for(let i=0;i<pesquisas.length;i++){

                             let pesquisa = pesquisas[i];
                             expect(pesquisa instanceof Pesquisa).toBeTruthy();
                             expect(pesquisa.id).toBe(idsPesquisa[i]);
                         }

                    }catch(e){
                        fail(e);
                    }
                    done();    

                } )  

             })();
        });
        it('Requisição ao serviço getpesquisas sem idsPesquisa passado como parâmetro',  (done)=>{
             inject([PesquisaService3],
                (pesquisaService: PesquisaService3) =>  {

                pesquisaService.getPesquisas([]).subscribe(pesquisas =>{

                    try{    
                         expect(pesquisas).toHaveLength(0);

                    }catch(e){
                        fail(e);
                    }
                    done();    

                } )  

             })();
        });

    })

    describe('getPesquisasPorAbrangenciaTerritorial', () => {
        
        let idsPesquisa = [13,15,45];
        it('deve responder apenas as pesquisas com determinada abrangência territorial', (done)=>{
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) =>  {

                pesquisaService.getPesquisasPorAbrangenciaTerritorial(niveisTerritoriais.municipio.label).subscribe(pesquisas =>{

                    serviceResponse = pesquisas;
                    try{
                         for(let i=0;i<pesquisas.length;i++){
                              
                              let pesquisa = pesquisas[0];
                              //expect(pesquisa.id).toBe(idsPesquisa[i]);
                         }
                        
                    }catch(e){
                         
                         fail(e);
                    }
                    done();
                })
            })();
        })

        it('deve responder um array vazio caso não haja pesquisas com aquela abrangência', (done)=>{
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                pesquisaService.getPesquisasPorAbrangenciaTerritorial(niveisTerritoriais.macrorregiao.label).subscribe(pesquisas => {
                  
                    try{
                        expect(pesquisas).toHaveLength(0);
                        expect(pesquisas).toEqual([]);
                    }catch(e){
                        fail(e);
                    }
                    done();
                })
                
            })();
        })

        it('deve retornar Erro caso não exista o nivel territorial consultado',(done)=>{
            inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {              
                const nivelInexistente = 'nivelInexistente';
                const errorMessage = `Não existe o nível territorial pesquisado. Favor verifique sua solicitação. [nivelterritorial: ${nivelInexistente}]`;

                pesquisaService.getPesquisasPorAbrangenciaTerritorial(nivelInexistente).subscribe( ()=>{ done();} ,err => {
                    serviceResponse = err;
                    try{
                        expect(serviceResponse.message).toBe(errorMessage);
                    }catch(e){
                        fail(e);
                    }
                    done();
                     
                })

               
            })();
        })

    })

    describe('getPesquisa', () => {

        let idPesquisa = 13;
        it('retorna a pesquisa com o valor de id passado para a função', (done)=>{
                inject([PesquisaService3], (pesquisaService: PesquisaService3) => {

                    pesquisaService.getPesquisa(idPesquisa).subscribe(pesquisa =>{

                            
                            try{
                                 expect(pesquisa instanceof Pesquisa).toBeTruthy()
                                 expect(pesquisa.id).toBe(idPesquisa);
                            }catch(e){
                                fail(e);
                            }
                            done();
                    },err=>{
                       
                        fail(err);
                        done();
                    } )
                   
                   
                })();
        });

        it('retorna erro caso não haja pesquisa com a id solicitada',(done)=>{
           inject([PesquisaService3],
                (pesquisaService: PesquisaService3) => {

                const pesquisaId = 130;
                const errorMessage = `Não foi possível recuperar a pesquisa solicitada. Verifique a solicitação ou tente novamente mais tarde. [id: ${pesquisaId}]`;

                pesquisaService.getPesquisa(pesquisaId).subscribe(() => { done(); }, err =>{

                        serviceResponse = err;
                        try{
                                expect(serviceResponse.message).toBe(errorMessage);
                        }catch(e){
                                fail(e);
                        }
                        done();
                } );
               
            })();
        });
        
    })

})
