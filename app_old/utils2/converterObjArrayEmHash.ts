import { getProperty } from '.';
export function converterObjArrayEmHash(array: Array<any>, keyPath: string, manyElementsAtSameProperty = false) {
    return manyElementsAtSameProperty
        ? _hashManyValues(array, keyPath)
        : _hashUniqueValue(array, keyPath);
}

function _hashUniqueValue(array: Array<any>, keyPath: string) {
    return array.reduce((hash, item) => {
        const label = getProperty(keyPath, item);

        if (isInvalidLabel(typeof label)) {
            throw new TypeError(`A propriedade ${keyPath} do objeto deve ter valor do tipo number ou string. [tipo: ${typeof label}, elemento: ${JSON.stringify(item)}]`);
        }
        

        if (hash[label]) {
            throw new Error(`Mais de um item possui o mesmo valor de referência. Verifique as informações ou considere utilizar a função com a flag 'manyElementsAtSameProperty'. [elemento1: ${JSON.stringify(hash[label])}, elemento2: ${JSON.stringify(item)}}]`)
        }

        hash[label] = item;
        return hash;
    }, Object.create(null));
}

function _hashManyValues(array: Array<any>, keyPath: string) {
    return array.reduce((hash, item) => {
        const label = getProperty(keyPath, item);

         if (isInvalidLabel(typeof label)) {
            throw new TypeError(`A propriedade ${keyPath} do objeto deve ter valor do tipo number ou string. [tipo: ${typeof label}, elemento: ${JSON.stringify(item)}]`);
        }

        if (!hash[label]) { hash[label] = [] }

        hash[label].push(item);
        return hash;
    }, Object.create(null));
}

function isInvalidLabel(type: string): boolean {
    return type !== 'string' && type !== 'number';
}