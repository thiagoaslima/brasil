import { BasicLRUCache } from '../model';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';


export function RxGetAllCache({ cache, labelForAll = '__multi__all', labelsFromResponse }: { cache: BasicLRUCache, labelForAll?: string, labelsFromResponse: (...args) => Array<number | string> }) {

    return function _RxGetAllCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            let cached: ReplaySubject<any> = cache.get(labelForAll);

            if (cached) {
                return cached;
            } else {
                cached = new ReplaySubject(1);
                cache.set(labelForAll, cached);

                originalMethod.apply(this, args)
                    .subscribe(resp => {
                        let labels = labelsFromResponse(resp);
                        labels.forEach((label, idx) => cache.get(label).next(resp[idx]));
                        Observable
                            .combineLatest(...labels.map(label => cache[label]))
                            .subscribe(arr => this.cached.next(arr))
                    });

                return cached;
            }

        }

        return descriptor.value;
    };
}
