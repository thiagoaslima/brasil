import { BasicLRUCache } from '../basic-lru-cache.model';

import { ReplaySubject } from 'rxjs/ReplaySubject';

const _generateLabel = (...args) => JSON.stringify(args);
export function RxCache({cache, generateLabel = _generateLabel}: {cache: BasicLRUCache, generateLabel?: (...args) => number|string}) {    

    return function _RxCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
       const originalMethod = descriptor.value;

       descriptor.value = (...args) => {
           const label = generateLabel(...args);
           let cached: ReplaySubject<any> = cache.get(label);
        
           if (!cached) {
               cached = new ReplaySubject(1);
               cache.set(label, cached);

               originalMethod.call(target, ...args).subscribe(
                   (resp) => cached.next(resp),
                   (err) => {
                       cached.error(err);
                       cached = null;
                       cache.erase(label);
                   }
                );
           };

           return cached;
       } 

        Object.defineProperty(target, propertyKey, descriptor);
       return descriptor.value;
    };
}