import { listaNiveisTerritoriais } from '../../shared3/values/niveis-territoriais.values';
import { niveisTerritoriais } from '../../shared3/values';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

    private _niveisTerritoriais = {
        [niveisTerritoriais.pais.label]: false,
        [niveisTerritoriais.uf.label]: true,
        [niveisTerritoriais.municipio.label]: true
    };

    public isAberto$ = this._isOpen.asObservable();
    public state$ = this._state.asObservable();

    abrirSeletor(state?: string) {
        this._isOpen.next(true);

        if (state || state === '') {
            this.setState(state);
        }
    }

    fecharSeletor() {
        this._isOpen.next(false);
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

    bloquearNiveisTerritoriais(niveis: Array<string>): void {
        niveis.forEach(nivel => {
            this._niveisTerritoriais[nivel] = false;
        });
    }

    isNivelTerritorialAcessivel(nivelTerritorial: string): boolean {
        return this._niveisTerritoriais[nivelTerritorial];
    }
}
