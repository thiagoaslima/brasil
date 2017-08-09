import { Injectable } from '@angular/core';

import { niveisTerritoriais } from '../../shared3/values';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SeletorLocalidadeService {
    private _isOpen = new BehaviorSubject<boolean>(false);

    private _states = {
        '': true,
        'estados': false,
        'municipios': false,
        'municipiosTodos': false,
        'municipiosEstados': false,
        'municipiosMunicipios': false
    };
    private _state = new BehaviorSubject<any>(this._states);

    private _niveisTerritoriais = new BehaviorSubject({
        [niveisTerritoriais.pais.label]: true,
        [niveisTerritoriais.uf.label]: true,
        [niveisTerritoriais.municipio.label]: true
    });

    private _forceURL = new Subject<string>();

    public isAberto$ = this._isOpen.asObservable();
    public state$ = this._state.asObservable();
    public niveisTerrioriais$ = this._niveisTerritoriais.asObservable();
    public forceURL$ = this._forceURL.asObservable();

    abrirSeletor(state?: string) {
        this._isOpen.next(true);

        if (state || state === '') {
            this.setState(state);
        }
    }

    fecharSeletor() {
        this._isOpen.next(false);
        this.resetNiveisTerritoriais();
    }

    setState(state: string) {
        if (!this._states[state]) { throw new Error(`Não existe o estado definido. [state: ${state}]`); }

        Object.keys(this._states).forEach(key => this._states[key] = false);

        if (state === '') {
            this._states[''] = true;
        }

        if (state.startsWith('municipio')) {
            this._states.municipios = true;
            this._states[state] = true;
        }

        if (state === 'estados') {
            this._states.estados = true;
        }

        this._state.next(this._states);
    }

    bloquearNiveisTerritoriais(niveis: string|Array<string>): void {
        let _niveis = Array.isArray(niveis) ? niveis : [niveis];
        let value = this._niveisTerritoriais.getValue();

        _niveis.forEach(nivel => {
            value[nivel] = false;
        });

        this._niveisTerritoriais.next(value);
    }

    resetNiveisTerritoriais(): void {
        this._niveisTerritoriais.next({
            [niveisTerritoriais.pais.label]: true,
            [niveisTerritoriais.uf.label]: true,
            [niveisTerritoriais.municipio.label]: true
        });
    }

    forcePage(url: string) {
        this._forceURL.next(url);
    }
}
