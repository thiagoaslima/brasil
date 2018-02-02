import { BasicLRUCache } from '../model';
import { CacheFactory } from '../cacheFactory.service';

import { ReplaySubject } from 'rxjs/ReplaySubject';

export function RxSimpleCache({ cache, customKey }: { cache: BasicLRUCache, customKey?: string }) {
    return function _RxSimpleCache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            const label = customKey || `${propertyKey}-${JSON.stringify(args)}`;
            let cached: ReplaySubject<any> = cache.get(label);

            if (!cached) {
                cached = new ReplaySubject(1);
                cache.set(label, cached);

                originalMethod.apply(this, args).subscribe(
                    (resp) => cached.next(resp),
                    (err) => {
                        cached.error(err);
                        cache.erase(label);
                    }
                );
            };

            return cached;
        };

        return descriptor;
    };
}