import { BasicLRUCache } from '../model';
export function SyncCache({cache}: {cache: BasicLRUCache}) {

    return function _ObservableCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
       const originalMethod = descriptor.value;

       descriptor.value = function (args) {
           const label = JSON.stringify(args)
           let cached = cache.get(label);

           if (!cached) {
               cached = originalMethod.apply(this, args)
               cache.set(label, cached);
           };

           return cached;
       } 

       return descriptor;
    };
}