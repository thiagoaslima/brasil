/// <reference types="jest" />
import { converterObjArrayEmHash } from './converterObjArrayEmHash';

describe('converterArrayEmHash', () => {

    it('deve transformar um array em um objeto cujas propriedades são os valores de cada item', () => {
        const array = [{ prop: 1 }, { prop: 2 }, { prop: 3 }];
        const expected = { 1: array[0], 2: array[1], 3: array[2] }
        const actual = converterObjArrayEmHash(array, 'prop')

        expect(actual).toEqual(expected);
        expect(actual[1]).toBe(array[0]);
    })

    it('deve retornar o mesmo elemento/referência e não uma cópia', () => {
        const array = [{ prop: 1 }, { prop: 2 }, { prop: 3 }];
        const expected = { 1: array[0], 2: array[1], 3: array[2] }
        const actual = converterObjArrayEmHash(array, 'prop')

        expect(actual[1]).toBe(array[0]);
        expect(actual[2]).toBe(array[1]);
        expect(actual[3]).toBe(array[2]);
    })

    it('deve lançar erro caso haja mais de um elemento para o mesmo label e a flag "manyElementsAtSameProperty" esteja com valor false', () => {
         const array = [{ prop: 1 }, { prop: 2 }, { prop: 1 }];

         expect(() => converterObjArrayEmHash(array, 'prop')).toThrowError(Error);
    })

    it('deve ter os valores como arrays caso receba o parâmetro manyElementsAtSameProperty', () => {
        const array = [{ prop: 1, id: 1 }, { prop: 2, id: 2 }, { prop: 3, id: 3 }, { prop: 1, id: 4 }];
        const expected = { 1: [array[0], array[3]], 2: [array[1]], 3: [array[2]] }
        const actual = converterObjArrayEmHash(array, 'prop', true)

        expect(actual).toEqual(expected);
    })

    it('deve ser capaz de acessar propriedades aninhadas em objetos complexos', () => {
        const array = [{ prop: { test: 1 } }, { prop: { test: 2 } }, { prop: { test: 3 } }];
        const expected = { 1: array[0], 2: array[1], 3: array[2] }
        const actual = converterObjArrayEmHash(array, 'prop.test')

        expect(actual[1]).toBe(array[0]);
        expect(actual[2]).toBe(array[1]);
        expect(actual[3]).toBe(array[2]);
    })

    it('deve lançar erro caso as propriedades do hash não sejam numeros ou strings', () => {
        const array1 = [{ prop: { a: 1 } }, { prop: 2 }, { prop: 3 }];
        const array2 = [{ prop: [1, 2, 3] }, { prop: 2 }, { prop: 3 }];
        const array3 = [{ prop: null }, { prop: 2 }, { prop: 3 }];
        const array4 = [{ prop: undefined }, { prop: 2 }, { prop: 3 }];
        const array5 = [{ prop: true }, { prop: 2 }, { prop: 3 }];
        const array6 = [{ prop: () => { } }, { prop: 2 }, { prop: 3 }];
        const array7 = [{ prop: 1 }, { prop: 2 }, { prop: 3 }];
        const array8 = [{ prop: 'a' }, { prop: 2 }, { prop: 3 }];

        expect(() => converterObjArrayEmHash(array1, 'prop')).toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array2, 'prop')).toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array3, 'prop')).toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array4, 'prop')).toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array5, 'prop')).toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array6, 'prop')).toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array7, 'prop')).not.toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array8, 'prop')).not.toThrowError(TypeError);
    })

    it('deve lançar erro caso o objeto não possua alguma propriedade listada no keyPath', () => {
        const array = [{ prop: { test: 1 } }, { prop: { test: 2 } }, { prop: { test: 3 } }];

        expect(() => converterObjArrayEmHash(array, 'property.test')).toThrowError(TypeError);
        expect(() => converterObjArrayEmHash(array, 'prop.teste')).toThrowError(TypeError);
    })
})