/// <reference types="jest" />
/// <reference path="./jasmine.custom.matcher.d.ts"/>

import { Http,HttpModule,BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Localidade } from '../models';
import { IndicadorService3, PesquisaService3, LocalidadeService3, ResultadoService3,RankingService3} from '.';


import { arrayMatcher} from './jasmine.custom.matcher';

describe('LocalidadeServiceE2E', () => {
    let connection, mockResponse, resultadosDTO, serviceResponse;

    beforeEach(() => {
        connection = null;
        serviceResponse = null;

        TestBed.configureTestingModule({
            imports:[HttpModule],
            providers: [
                {
                    provide: LocalidadeService3,
                    deps: [Http],
                    useFactory: (http) => new LocalidadeService3(http)
                }
            ]
        })
        jasmine.addMatchers(arrayMatcher);
    })
    afterEach(() => {
            //RankingService3.cache.clear();
    })

    describe('Testes no serviço getMunicipioByCoordinates', () => {

       
        it('Testa retorno de localidades relacionado as coordenadas passadas', (done)=>{
            inject([LocalidadeService3], (localidadeService: LocalidadeService3) => {
                
                let latitude  = -22.345678;
                let longitude = -44.321567;
                localidadeService.getMunicipioByCoordinates(latitude,longitude).subscribe(localidade => {
                   
                    try{
                        expect(localidade instanceof Localidade).toBeTruthy();
                        
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
