import { isDevMode } from '@angular/core';

export class BasicLRUCache {
    private _cache = Object.create(null) as { [key: string]: { value: any, uses: number } };
    private _recordsLimit: number;

    constructor(recordsLimit = 1) {
        this.setRecordsLimit(recordsLimit);
    }

    /**
     * check if there is a value in our store
     */
    has(key: string | number): boolean {
        let _key = this._normalizeKey(key);
        return this._cache[_key] !== undefined;
    }

    /**
     * store our state
     */
    set(key: string | number, value: any): void {
        let _key = this._normalizeKey(key);
        this._manageLimit();
        this._cache[_key] = {
            value: value,
            uses: 0
        };
    }

    /**
     * get our cached value
     */
    get(key: string | number): any {
        let _key = this._normalizeKey(key);

        if (this.has(key)) {
            const item = this._cache[_key];
            item.uses++;
            return item.value;
        }

        return undefined;
    }

    erase(label) {
        delete this._cache[this._normalizeKey(label)];
    }

    /**
     * release memory refs
     */
    clear(): void {
        this._cache = Object.create(null);
    }

    setRecordsLimit(qty: number): void {
        this._recordsLimit = qty;
    }

    size(): number {
        return Object.keys(this._cache).length;
    }

    private _manageLimit() {
        if (this._aboveLimit()) {
            this._eraseLeastUsed();
        }
    }

    private _aboveLimit() {
        return this.size() && this.size() >= this._recordsLimit;
    }

    private _eraseLeastUsed(): void {
        const hash = this._groupRecordsByUseTimes();
        const uses = Object.keys(hash).map(value => Number.parseInt(value, 10));

        if (uses.length > 0) {
            let i = 0;

            while (this._aboveLimit()) {
                const useTimes = uses[i];

                hash[useTimes].forEach(key => {
                    delete (this._cache[key])
                });
                i++;
            }
        }
    }

    private _groupRecordsByUseTimes() {
        return Object.keys(this._cache).reduce((hash, key) => {
            const obj = this._cache[key];

            if (!hash[obj.uses]) {
                hash[obj.uses] = [];
            }

            hash[obj.uses].push(key);

            return hash;
        }, Object.create(null) as { [uses: number]: string[] });
    }

    private _normalizeKey(key: string | number): string {
        if (isDevMode() && this._isInvalidValue(key)) {
            throw new Error('Please provide a valid key to save in the CacheService');
        }

        return JSON.stringify(key);
    }

    private _isInvalidValue(key): boolean {
        return key === null ||
            key === undefined ||
            key === 0 ||
            key === '' ||
            typeof key === 'boolean' ||
            Number.isNaN(<number>key);
    }
}
