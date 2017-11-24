import { forceArray } from './forceArray';

describe('forceArray', () => {

    it('retorna a mesma instância do array passado como parâmetro', () => {
        const array = [1, 2 , 3];
        expect(forceArray(array)).toBe(array);
    })

    it('retorna o parâmetro dentro de um array, caso aquele não seja um array', () => {
        expect(forceArray('string')).toEqual(['string']);
        expect(forceArray(1)).toEqual([1]);
        expect(forceArray(null)).toEqual([null]);
        expect(forceArray(true)).toEqual([true]);
        expect(forceArray(undefined)).toEqual([undefined]);
        
        const obj = {};
        expect(forceArray(obj)).toEqual([obj]);
        expect(forceArray(obj)[0]).toBe(obj);
    })
})