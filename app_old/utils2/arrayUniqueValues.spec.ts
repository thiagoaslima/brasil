/// <reference types="jest" />
import { arrayUniqueValues } from './arrayUniqueValues';

describe('arrayUniqueValues', () => {

    it('deve retornar um array sem valores duplicados', () => {
        const array = [1, 1, 2, 3];
        const expected = [1, 2, 3];

        expect(arrayUniqueValues(array)).toEqual(expected);
    });

    it('deve diferenciar os strings e números', () => {
        const array = [1, '1', 2];
        expect(arrayUniqueValues(array)).toEqual(array);
        expect(arrayUniqueValues(array)).not.toBe(array);
    })

    it('deve comparar objetos por referência e não por valor', () => {
        const array = [{id: 1}, {id: 1}];
        expect(arrayUniqueValues(array)).toEqual(array);
        expect(arrayUniqueValues(array)).not.toBe(array);
    })
})