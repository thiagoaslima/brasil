interface Tree<T> {
    children: any[]
}
export function flatTree(root, childrenProp = 'children') {
    if (Array.isArray(root)) {
        return [].concat(...root.map(item  => flatTree(item, childrenProp)));
    }
    let arr = [root];
    if (root[childrenProp] && root[childrenProp].length > 0) {
        arr = arr.concat(...root[childrenProp].map(item => flatTree(item, childrenProp)));
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