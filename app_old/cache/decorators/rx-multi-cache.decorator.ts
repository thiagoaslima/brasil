import { BasicLRUCache } from '../model';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';

export function RxMultiCache({ cache, labelsFromArguments, labelsFromResponse }: { cache: BasicLRUCache, labelsFromArguments: (...args) => Array<number | string>, labelsFromResponse: (...args) => Array<number | string> }) {

    return function _RxMultiCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            // identificar cada item a ser recuperado
            let items = labelsFromArguments(...args);

            // buscar no cache cada item individualmente
            // testar se todos os itens foram recuperados do cache
            let { caches, notFound } = items.reduce((acc, label) => {
                let item = cache.get(label);

                if (!item) {
                    item = new ReplaySubject(1);
                    cache.set(label, item);
                    acc.notFound = true;
                }

                acc.caches.push(item);
                return acc;
            }, { caches: [], notFound: false })

            const data$ = Observable.combineLatest(...caches);

            // rodar a função original para recuperar os itens não presentes no cache
            if (notFound) {
                originalMethod.apply(this, args)
                    .subscribe(resp => {
                        let labels = labelsFromResponse(resp);
                        labels.forEach((label, idx) => cache.get(label).next(resp[idx]));
                    });
            }

            return data$;
        };

        return descriptor;
    };
}
