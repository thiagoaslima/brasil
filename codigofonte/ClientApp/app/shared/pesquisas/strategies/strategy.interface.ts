import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/publishReplay';

export interface RetrieveStrategy<T> {
    retrieve(...args: any[]): T
}

export class StateStrategyManager {
    _resolved = false
    _loading = false
    _subject = new ReplaySubject<any>(1);

    asObservable() {
        return this._subject.asObservable().share();
    }

    constructor(
        private _observable
    ) { 
        this._observable.subscribe(value => this._subject.next(value));
    }

    loading() {
        this._resolved = false;
        this._loading = true;
    }

    isLoading() {
        return !this._resolved && this._loading;
    }

    resolve() {
        this._resolved = true;
        this._loading = false;
    }

    isResolved() {
        return this._resolved && !this._loading;
    }

    isInitial() {
        return !this._resolved && !this._loading;
    }

    update() {
        this.loading();
        return this._observable
            .filter(value => value !== undefined && value !== null)
            .distinctUntilChanged()
            .map((value) => {
                this.resolve();
                this._subject.next(value);
                this._subject.complete();
                return value;
            });
    }
}