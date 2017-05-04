export function converterObjArrayEmHash(array: Array<any>, keyPath: string, manyElementsAtSameProperty = false) {
    return manyElementsAtSameProperty
        ? _hashManyValues(array, keyPath)
        : _hashUniqueValue(array, keyPath);
}

function _hashUniqueValue(array: Array<any>, keyPath: string) {
    return array.reduce((hash, item) => {
        const label = getLabel(keyPath, item);

        if (hash[label]) {
            throw new Error(`Mais de um item possui o mesmo valor de referência. Verifique as informações ou considere utilizar a função com a flag 'manyElementsAtSameProperty'. [elemento1: ${hash[label]}, elemento2: ${item}}]`)
        }

        hash[label] = item;
        return hash;
    }, Object.create(null));
}

function _hashManyValues(array: Array<any>, keyPath: string) {
    return array.reduce((hash, item) => {
        const label = getLabel(keyPath, item);

        if (!hash[label]) { hash[label] = [] }

        hash[label].push(item);
        return hash;
    }, Object.create(null));
}

function getLabel(keyPath, item) {
    const propertiesArray = keyPath.split('.');

    const label = propertiesArray.reduce((val, key) => {
        if (!Object.prototype.hasOwnProperty.call(val, key)) {
            const errorMessage = `O objeto consultado não possui a propriedade ${key}. [path: ${keyPath}, elemento: ${JSON.stringify(item)}, ${JSON.stringify(val)}]`;
            throw new TypeError(errorMessage);
        }

        return val[key];
    }, item);

    if (isInvalidLabel(typeof label)) {
        throw new TypeError(`A propriedade ${keyPath} do objeto deve ter valor do tipo number ou string. [tipo: ${typeof label}, elemento: ${JSON.stringify(item)}]`);
    }

    return label;
}
function isInvalidLabel(type: string) {
    return type !== 'string' && type !== 'number';
}