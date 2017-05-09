/// <reference types="jest" />
import { BasicLRUCache } from './basic-lru-cache.model';

describe('BasicModel', () => {
    let cache;

    beforeEach( () => {
        cache = new BasicLRUCache(10);
    })

    it('should save an item', () => {
        cache.set('teste', 'funciona');
        expect(cache.get('teste')).toBe('funciona');
    })

    it('should overwrite a pre-saved item', () => {
        cache.set('teste', 1);
        cache.set('teste', 2);
        expect(cache.get('teste')).toBe(2);
    })

    it('should give the number of items recorded', () => {
        cache.set('teste1', 1);
        cache.set('teste1', 2);
        cache.set('teste2', 2);
        cache.set('teste3', 2);
        expect(cache.size()).toBe(3);
    })

    it('should erase all items on clear', () => {
        cache.set('teste', 1);
        cache.set('teste', 2);
        cache.clear();
        expect(cache.get('teste')).toBeUndefined();
        expect(cache.size()).toBe(0);
    })

    it('should keep as many register as recordsLimit - 1', () => {
        const cache = new BasicLRUCache(2);
        cache.set('teste1', 1);
        cache.set('teste2', 2);
        cache.set('teste3', 3);
        
        expect(cache.get('teste1')).toBeUndefined();
        expect(cache.get('teste2')).toBeUndefined();
        expect(cache.get('teste3')).toBe(3);
        expect(cache.size()).toBe(1);
    })

    it('should erase firstly the least used records', () => {
        const cache = new BasicLRUCache(2);
        cache.set('teste1', 1);
        cache.set('teste2', 2);
        cache.get('teste1');
        cache.set('teste3', 3);

        expect(cache.get('teste1')).toBe(1);
        expect(cache.get('teste2')).toBeUndefined();
        expect(cache.get('teste3')).toBe(3);
        expect(cache.size()).toBe(2);
    })
})
