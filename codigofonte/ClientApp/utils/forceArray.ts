export function forceArray(value: any) {
    return Array.isArray(value) ? value : [value];
}