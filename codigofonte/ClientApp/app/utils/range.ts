export function range(start: string | number, end: string | number, step = 1): number[] {  
    let _start = typeof start === 'number' ? start : parseInt(start, 10);
    let _end = typeof end === 'number' ? end : parseInt(end, 10);

    if (!_start || !_end || !step) {
        throw new Error('Check the arguments  passed to this function');
    }

    let diff = _end - _start;
    if (diff < 0)  {
        step = Math.abs(step) * -1;
    }

    let range: number[] = [];
    while(step > 0 ? _end >= _start : _start >= _end) {
        range.push(_start);
        _start = _start + step;
    }

    return range;
}