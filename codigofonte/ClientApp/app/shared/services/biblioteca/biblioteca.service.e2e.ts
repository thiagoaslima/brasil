/// <reference types="jest" />

import { BibliotecaService } from '.';
import { Http, HttpModule } from '@angular/http';
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

// describe('BibliotecaServiceE2E', () => {

//     beforeEach(() => {

//         TestBed.configureTestingModule({
//             imports: [HttpModule],
//             providers: [
//                 {
//                     provide: BibliotecaService,
//                     deps: [Http],
//                     useFactory: (http) => new BibliotecaService(http)
//                 }
//             ]
//         });

//     });

//     describe('getValues', () => {
//         it('retorna o json da base da biblioteca quando localidade é válido', (done) => {
//             inject([BibliotecaService], (bibliotecaService: BibliotecaService) => {

//                 bibliotecaService.getValues(330455).subscribe(response => {

//                     try {
//                         expect(typeof response).toBe('object')
//                         expect(Object.keys(response).length).toBe(16);
//                         expect(Object.keys(response).sort()).toEqual([
//                             'ANO',
//                             'ASSUNTOS',
//                             'ESTADO',
//                             'ESTADO1',
//                             'FORMACAO_ADMINISTRATIVA',
//                             'GENTILICO',
//                             'HISTORICO',
//                             'HISTORICO_FONTE',
//                             'JPG',
//                             'MP3',
//                             'MUNICIPIO',
//                             'NOTAS',
//                             'REGISTRO',
//                             'TIPO_MATERIAL',
//                             'TITULO_UNIFORME',
//                             'VISUALIZACAO'
//                           ]);
//                     } catch (err) {
//                         fail(err);
//                     }

//                     done();
//                 });
//             })();
//         });

//         it('retorna null quando localidade é inválido', (done) => {
//             inject([BibliotecaService], (bibliotecaService: BibliotecaService) => {

//                 bibliotecaService.getValues(-1).subscribe(response => {

//                     try {
//                         expect(response).toBeNull();
//                     } catch (err) {
//                         fail(err);
//                     }

//                     done();
//                 });
//             })();
//         });

//     });

// });
