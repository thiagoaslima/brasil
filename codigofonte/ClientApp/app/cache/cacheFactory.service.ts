import { Injectable } from '@angular/core';

import { BasicLRUCache } from './model';

@Injectable()
export class CacheFactory {
    private static _caches = Object.create(null) as {[name: string]: BasicLRUCache};
    static recordsLimit = 50;

    static hasCache(name: string): boolean {
        return CacheFactory._caches[name] !== undefined;
    }

    static getCache(name: string): BasicLRUCache {
        if (!CacheFactory.hasCache(name)) {
           return CacheFactory.createCache(name);
        } 

        return CacheFactory._caches[name];
    }

    static createCache(name: string, recordsLimit?): BasicLRUCache {
        CacheFactory._caches[name] = new BasicLRUCache(recordsLimit || CacheFactory.recordsLimit);
        return CacheFactory._caches[name];
    }
}