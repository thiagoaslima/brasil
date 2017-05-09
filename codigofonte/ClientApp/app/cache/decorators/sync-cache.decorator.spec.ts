/// <reference types="jest" />
import { SyncCache } from '.';
import { BasicLRUCache } from '../basic-lru-cache.model';

describe('SyncCache', () => {

    let obj, decorated, mock;

    beforeEach(() => {
        const decorate = SyncCache({
            cache: new BasicLRUCache(5)
        });
        mock = jest.fn();
        obj = {
            identity: (val) => {
                mock();
                return val;
            }
        }

        decorate(obj, 'identity', Object.getOwnPropertyDescriptor(obj, 'identity'));
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

