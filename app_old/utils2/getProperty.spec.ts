/// <reference types="jest" />
import { getProperty } from './getProperty';

describe('getProperty', () => {

    it('deve retornar o valor da propriedade solicitada', () => {
        const obj = { prop: 1 };
        const actual = getProperty('prop', obj)
        
        expect(actual).toBe(1);
    })

     it('deve ser capaz de acessar propriedades aninhadas em objetos complexos', () => {
        const obj = { prop: { test: 1 }};
        const actual = getProperty('prop.test', obj)

        expect(actual).toBe(1);
    })

     it('deve lançar erro caso o objeto não possua alguma propriedade listada no keyPath', () => {
        const obj = { prop: { test: 1 }};

        expect(() => getProperty('property.test', obj)).toThrowError(TypeError);
        expect(() => getProperty('prop.teste', obj)).toThrowError(TypeError);
    })
})