interface Tree<T> {
    children: any[]
}
export function flatTree(root) {
    if (Array.isArray(root)) {
        return [].concat(...root.map(flatTree));
    }
    let arr = [root];
    if (root.children.length) {
        arr = arr.concat(...root.children.map(flatTree));
    }
    return arr;
}
export function flatMap(array: Array<any|any[]>, callbackfn): any[] {
    return [].concat(...array.map(callbackfn));
}
export function flat<T>(array: T[][]): T[] {
    return [].concat(...array);
}
export function reduceOnTree(array, propKeys: string | string[]) {
    let _keys = Array.isArray(propKeys) ? propKeys : [propKeys];
    return array.map(item => {
        return Object.assign(
            _keys.reduce((obj, key) => { obj[key] = item[key]; return obj; }, {}),
            item['prototype'],
            { children: reduceOnTree(item.children || [], _keys) }
        );
    });
}