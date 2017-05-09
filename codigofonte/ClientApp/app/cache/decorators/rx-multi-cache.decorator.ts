import { BasicLRUCache } from '../basic-lru-cache.model';

import { ReplaySubject } from 'rxjs/ReplaySubject';

const _generateLabel = (...args) => JSON.stringify(args);
export function RxMultiCache({cache}: {cache: BasicLRUCache}) {    

    return function _RxMultiCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
       const originalMethod = descriptor.value;

       descriptor.value = (...args) => {
           // identificar cada item a ser recuperado
           let items = separarArgumentos(...args);
            
           // buscar no cache cada item individualmente
           
           // testar se todos os itens foram recuperados do cache
           
           // rodar a função original para recuperar os itens não presentes no cache

           // gravar individualmente cada item no cache

           // reunir retornos e caches
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