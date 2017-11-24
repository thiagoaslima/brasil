/// <reference types="jest" />
import { SyncCache } from '.';
import { BasicLRUCache } from '../model';

describe('SyncCache', () => {

    let obj, decorated, mock;

    beforeEach(() => {

        mock = jest.fn();
        class Obj {
            @SyncCache({
                cache: new BasicLRUCache(5)
            })
            identity(val) {
                mock();
                return val;
            }

        }
        obj = new Obj()
        
    })

    it('should call the original method the first time', () => {
        expect(obj.identity(1)).toBe(1);
        expect(mock).toHaveBeenCalled()
    })

    it('should call the original method only the first time', () => {
        expect(obj.identity(1)).toBe(1);
        expect(obj.identity(1)).toBe(1);
        expect(mock).toHaveBeenCalledTimes(1)
    })
})

