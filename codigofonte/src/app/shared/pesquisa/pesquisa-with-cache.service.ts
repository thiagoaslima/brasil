import { Inject, Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';

import { CacheService } from '../cache.service';
import { SystemCache } from '../system-cache.service';
import { Pesquisa, Indicador } from './pesquisa.interface';
import { PesquisaService } from './pesquisa.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

@Injectable()
export class PesquisaServiceWithCache {

    constructor(
        _cache: CacheService,
        _http: Http
    ) {
        let instance = new Proxy(new PesquisaService(_http), {
            get(target, propKey) {

                switch (propKey) {
                    case "getAllPesquisas":
                        let cacheKey = SystemCache._buildKey.allPesquisas();

                        if (_cache.has(cacheKey)) {
                            return () => Observable.of(_cache.get(cacheKey));
                        }

                        return function() {
                            let subject = new Subject();

                            target.getAllPesquisas()
                                .subscribe(pesquisas => {
                                    subject.next(pesquisas);
                                    _cache.set(cacheKey, pesquisas);
                                });

                            _cache.set(cacheKey, subject);
                            return subject.asObservable();
                        }


                    default:
                        return target[propKey];

                }

            }
        });

        return instance;
    }

};

