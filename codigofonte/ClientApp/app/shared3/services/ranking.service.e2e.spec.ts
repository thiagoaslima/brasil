/// <reference types="jest" />
/// <reference path="./jest.custom.matcher.d.ts"/>

import { Http,HttpModule,BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Ranking } from '../models';
import { IndicadorService3, PesquisaService3, LocalidadeService3, ResultadoService3,RankingService3} from '.';


import { arrayMatcher} from './jest.custom.matcher';

describe('RankingServiceE2E', () => {
    let connection, mockResponse, resultadosDTO, serviceResponse;
    let propriedadesRanking = ['indicadorId','periodo','contexto','unidade'];
    beforeEach(() => {
        connection = null;
        serviceResponse = null;

        TestBed.configureTestingModule({
            imports:[HttpModule],
            providers: [
               
            ]
        })
        jest.addMatchers(arrayMatcher);
    })
    afterEach(() => {
            //RankingService3.cache.clear();
    })

    describe('Testes no serviço getRankingsIndicador', () => {

       
        it('Testa retorno de rankings relacionado ao indicador passado por parâmetro', (done)=>{
            inject([RankingService3], (rankingService: RankingService3) => {
                
                let idsIndicadores = [ { 
                                            "indicadorId":25207,
                                            "periodo":"2000"
                                        }
                                      ];
                let localidade = 330455;
                let contexto = ["BR"];
                rankingService.getRankingsIndicador(idsIndicadores,contexto,localidade).subscribe(rankings => {
                   
                    try{
                        for(let i=0;i<rankings.length;i++){
                            let ranking = rankings[i];
                            expect(ranking instanceof Ranking).toBeTruthy();
                            expect(ranking).contemPropriedades(propriedadesRanking);
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
        it('Testa retorno de rankings relacionado a mais de um indicador passado por parâmetro', (done)=>{
            inject([RankingService3], (rankingService: RankingService3) => {
                
                let idsIndicadores = [ { 
                                            "indicadorId":25207,
                                            "periodo":"2010"
                                        },
                                        { 
                                            "indicadorId":25206,
                                            "periodo":"2010"
                                        },
                                        
                                      ];
                let localidade = 330455;
                let contexto = ["BR"];
                rankingService.getRankingsIndicador(idsIndicadores,contexto,localidade).subscribe(rankings => {
                   
                    try{
                        for(let i=0;i<rankings.length;i++){

                            let ranking = rankings[i];
                            expect(ranking instanceof Ranking).toBeTruthy();
                            expect(ranking).contemPropriedades(propriedadesRanking);
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
