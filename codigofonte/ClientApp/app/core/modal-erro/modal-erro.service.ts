import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ModalErrorService {

    private notify = new Subject<boolean>();
    private notifyObservable$ = this.notify.asObservable();    


    constructor() { }

    public showError(): void{

        this.notify.next(true);
    }

    public hideError(): void{

        this.notify.next(false);
    }

    public hasError(): Observable<boolean>{

        return this.notifyObservable$;
    }
}