/// <reference types="jest" />
import { RxMultiCache } from './rx-multi-cache.decorator';
import { BasicLRUCache } from '../model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('RxMultiCache', () => {
    let obj, decorated, mock;
    const objects = { 1: { id: 1 }, 2: { id: 2 }, 3: { id: 3 }, 4: { id: 4 }, 5: { id: 5 }, 6: { id: 6 } };

    beforeEach(() => {

        mock = jest.fn();
        class Obj {

            @RxMultiCache({
                cache: new BasicLRUCache(5),
                labelsFromArguments: (ids) => ids.map(JSON.stringify),
                labelsFromResponse: (objArray) => objArray.map(obj => JSON.stringify(obj.id))
            })
            getObjects(ids: number[]) {
                mock();
                return Observable.of(ids.map(id => objects[id]));
            }
        }

        obj = new Obj()
    })

    it('should call the original method the first time', () => {
        obj.getObjects([1]).subscribe(res => {
            expect(res).toEqual([objects[1]])
            expect(mock).toHaveBeenCalled()
        });
    })

    it('should call the original method the first time', () => {
        obj.getObjects([1, 4, 5, 6]).subscribe(res => {
            expect(res).toEqual([objects[1], objects[4], objects[5], objects[6]])
            expect(mock).toHaveBeenCalled()
        });
    })

    it('should call the original method only the first time', () => {
        obj.getObjects([1]).subscribe(_ => true);
        obj.getObjects([1]).subscribe(res => {
            expect(res).toEqual([objects[1]])
            expect(mock).toHaveBeenCalledTimes(1)
        });
    })
})