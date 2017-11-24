/// <reference types="jest" />
import { RxSimpleCache } from '.';
import { BasicLRUCache } from '../model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('RxCache', () => {

    let obj, decorated, mock;
    const cache = new BasicLRUCache(5);

    beforeEach(() => {
        mock = jest.fn();
        class Obj {
            @RxSimpleCache({
                cache: cache
            })
            identity (val) {
                mock(); 
                return Observable.of(val);
            }
        }
        obj = new Obj()
    })

    afterEach(() => cache.clear())

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

