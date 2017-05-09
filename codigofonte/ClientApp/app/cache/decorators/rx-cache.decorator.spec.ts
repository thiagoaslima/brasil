/// <reference types="jest" />
import { RxCache } from '.';
import { BasicLRUCache } from '../basic-lru-cache.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('RxCache', () => {

    let obj, decorated, mock;

    beforeEach(() => {
        const decorate = RxCache({
            cache: new BasicLRUCache(5)
        });
        mock = jest.fn();
        obj = {
            identity: (val) => {
                mock();
                return Observable.of(val);
            }
        }

        decorate(obj, 'identity', Object.getOwnPropertyDescriptor(obj, 'identity'));
    })

    it('should call the original method the first time', () => {
        obj.identity(1).subscribe(res => {
            expect(res).toBe(1)
            expect(mock).toHaveBeenCalled()
        });
    })

    it('should call the original method only the first time', () => {
        obj.identity(1).subscribe(_ => true);
        obj.identity(1).subscribe(res => {
            expect(res).toBe(1)
            expect(mock).toHaveBeenCalledTimes(1)
        });
    })
})

