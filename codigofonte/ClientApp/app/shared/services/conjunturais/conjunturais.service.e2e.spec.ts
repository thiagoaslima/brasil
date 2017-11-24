/// <reference types="jest" />

import { ConjunturaisService, LocalidadeService3 } from '.';
import { Http, HttpModule } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';


describe('ConjunturaisServiceE2E', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                {
                    provide: LocalidadeService3,
                    deps: [Http],
                    useFactory: (http) => new LocalidadeService3(http)
                },
                {
                    provide: ConjunturaisService,
                    deps: [Http, LocalidadeService3],
                    useFactory: (http, localidadeService) => new ConjunturaisService(http, localidadeService)
                }
            ]
        });

    });

    describe('getIndicadorAsResultado', () => {

        it('deve responder certo', (done) => {

            (inject([ConjunturaisService],
                (conjunturaisService: ConjunturaisService) => {

                    conjunturaisService
                        .getIndicadorAsResultado(5796, 1396, 1, '715[33611]')
                        .subscribe(response => {

                            try {
                                expect(response).toBeDefined();
                                expect(typeof response).toBe('object');
                            } catch (err) {
                                fail(err);
                            }
                            done();
                        });
                }
            )());

        });
    });
});
