import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SeletorLocalidadeService {
    private _isOpen = new BehaviorSubject<boolean>(false);

    public isAberto$ = this._isOpen.asObservable();

    abrirSeletor() {
        this._isOpen.next(true);
    }

    fecharSeletor() {
        this._isOpen.next(false);
    }
}
