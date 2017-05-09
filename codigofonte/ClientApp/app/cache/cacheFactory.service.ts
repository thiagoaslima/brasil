import { BasicLRUCache } from './basic-lru-cache.model';

export class CacheFactory {
    private static _caches = Object.create(null) as {[name: string]: BasicLRUCache};
    static recordsLimit = 50;

    static hasCache(name: string): boolean {
        return CacheFactory._caches[name] !== undefined;
    }

    static getCache(name: string): BasicLRUCache {
        if (!CacheFactory.hasCache(name)) {
           CacheFactory.createCache(name);
        } 

        return CacheFactory._caches[name];
    }

    static createCache(name: string, recordsLimit?) {
        CacheFactory._caches[name] = new BasicLRUCache(recordsLimit || CacheFactory.recordsLimit);
    }
}