/// <reference types="jest" />
import { curry } from './curry';

describe('curry', () => {

    it('currying declarado com todos os parâmetros retorna o valor da função', () => {
        const identity = (val) => val;
        const curried = curry(identity, 1);

        expect(curried).toBe(1);
    })
    
    it('currying declarado sem parâmetros, chamada com todos os parâmetros', () => {
        const identity = (val) => val;
        const curried = curry(identity);

        expect(curried(1)).toBe(1);
    })

    it('currying declarado sem parâmetros, chamada sem todos os parâmetros', () => {
        const sum = (a, b) => a + b;
        const curried = curry(sum);

        expect(curried(1)).toBeInstanceOf(Function);
        expect(curried(1)(1)).toBe(2);
    })

    it('currying declarado com 1 dos parâmetros, chamada com os demais parâmetros', () => {
        const sum = (a, b) => a + b;
        const curried = curry(sum, 1);

        expect(curried(1)).toBe(2);
    })
})