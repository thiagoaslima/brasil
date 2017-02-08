interface Tree<T> {
    children: T[]
}


export function flatTree<U extends Tree<any>>(root: U): U[] {
    let arr = [root];
    if (root.children.length) {
        arr = arr.concat(...root.children.map(flatTree));
    }
    return arr;
}

export function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
    return [].concat(...array.map(callbackfn));
}