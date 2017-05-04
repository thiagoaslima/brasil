import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share';

export class FooService {

    @BatchRequest({passThrough: true})
    passingThrough(id) {
        return this.simulateHttpRequest(id);
    }

    @BatchRequest({passThrough: false})
    batch(arr) {
        return this.simulateHttpRequest(arr);
    }

    simulateHttpRequest(id: number | number[]) {
        const arr = Array.isArray(id) ? id : [id];
        return Observable.of(arr.map(id => ({id: id})));
    }
}

function BatchRequest({ debounceTime = 10, passThrough = false } = {}) {
    let argumentsQueue = [];
    let clearTimeoutId = null;

    const updateArgumentsQueue = function (...args) {
        argumentsQueue.push(args)
    }
    const queueCalls = function (callback, context) {
        if (clearTimeoutId) return;

        clearTimeoutId = setTimeout(() => {
            callback.apply(context, argumentsQueue).subscribe(val => {
                console.log('callback', val);
                results.next(val)
            });
            reset();
        }, debounceTime)
    }

    const reset = function() {
        argumentsQueue = [];
        clearTimeoutId = null;
    }

    const results = new Subject();
    const response = results.asObservable().share();
    

    return function _batchRequestDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value.bind(target);

        descriptor.value = (...args) => {
            if (passThrough || originalMethod.__batchRequestDecorated) {
                console.log('test flag', originalMethod.__batchRequestDecorated);
                return originalMethod.apply(target, args);
            } 
            const sub = new Subject();
            const subs = response
                .subscribe(val => {
                    sub.next(val);
                    subs.unsubscribe();
                })

            updateArgumentsQueue(args);
            queueCalls(originalMethod, target);
            
            return sub.asObservable();
        };

        descriptor.value.__batchRequestDecorated = true;
    };
}
