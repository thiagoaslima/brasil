import { BasicLRUCache } from '../basic-lru-cache.model';
export function SyncCache({cache}: {cache: BasicLRUCache}) {

    return function _ObservableCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
       const originalMethod = descriptor.value;

       descriptor.value = (...args) => {
           let cached = cache.get(JSON.stringify(args));

           if (!cached) {
               cached = originalMethod.call(target, ...args)
               cache.set(JSON.stringify(args), cached);
           };

           return cached;
       } 

        Object.defineProperty(target, propertyKey, descriptor);
       return descriptor.value;
    };
}