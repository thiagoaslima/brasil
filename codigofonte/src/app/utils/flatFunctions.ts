interface Tree<T> {
    children: T[]
}


export function flatTree<T extends Tree<any>>(root: T|T[]): T[] {
    if (Array.isArray(root)) {
        return [].concat(...root.map(flatTree));
    }

    let arr = [root];
    if (root.children.length) {
        arr = arr.concat(...root.children.map(flatTree));
    }

    return arr;
}

export function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
    return [].concat(...array.map(callbackfn));
}

export function reduceOnTree<T extends Tree<any>>(array: T[], propKeys: string | string[]) {
    let _keys = Array.isArray(propKeys) ? propKeys : [propKeys];

    return array.map(item => {
        return Object.assign(
            _keys.reduce((obj, key) => { obj[key] = item[key]; return obj; }, {}),
            item['prototype'],
            { children: reduceOnTree(item.children || [], _keys) }
        );
    });
}