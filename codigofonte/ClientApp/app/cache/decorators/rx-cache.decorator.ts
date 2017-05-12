import { BasicLRUCache } from '../model';
import { PesquisaService3 } from '../../shared3/services'

import { ReplaySubject } from 'rxjs/ReplaySubject';


const _generateLabel = (args) => JSON.stringify(args);
export function RxCache({cache, labelFromArguments = _generateLabel}: {cache: BasicLRUCache, labelFromArguments?: (...args) => number|string}) {    

    return function _RxCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
       const originalMethod = descriptor.value;

       descriptor.value = function (...args) {
           const label = args.map(labelFromArguments)[0];
           let cached: ReplaySubject<any> = cache.get(label);
        
           if (!cached) {
               cached = new ReplaySubject(1);
               cache.set(label, cached);

               originalMethod.apply(this, args).subscribe(
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

       return descriptor;
    };
}