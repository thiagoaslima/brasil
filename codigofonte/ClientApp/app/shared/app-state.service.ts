import { ActivatedRoute, Params } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';


import { 
    Localidade,
    niveisTerritoriais,
    Pesquisa,
    LocalidadeService3,
    PesquisaService3,
    RouterParamsService
} from '.';


const _initialState = {
    pesquisa: null,
    localidade: null,
    tipo: ''
};

/**
 *
 *
 * @export
 * @class AppState
 */
@Injectable()
export class AppState {

    private _localidade: Localidade;
    private _pesquisa: Pesquisa;

    private _notify = new BehaviorSubject<any>(_initialState);
    private _appState$ = this._notify.asObservable().share();


    /**
     * Creates an instance of AppState.
     *
     * @param {LocalidadeService} _localidadeService
     * @param {RouterParamsService} _routerParamsService
     * @param {PesquisaService} _pesquisaService
     *
     * @memberOf AppState
     */
    public constructor(
        private _routerParamsService: RouterParamsService,
        private _localidadeService: LocalidadeService3,
        private _pesquisaService: PesquisaService3
    ) {
        const localidade$ = this._routerParamsService.params$
            .map(({ params = { uf: '', municipio: '' } }) => {
                let { uf, municipio } = params;

                if (municipio) {
                    return {
                        localidade: _localidadeService.getMunicipioBySlug(uf, municipio),
                        tipo: niveisTerritoriais.municipio.label
                    };
                }

                if (uf) {
                    return {
                        localidade: _localidadeService.getUfBySigla(uf),
                        tipo: niveisTerritoriais.uf.label
                    };
                }

                return {
                    localidade: _localidadeService.getRoot(),
                    tipo: niveisTerritoriais.pais.label
                };
            });

        const pesquisa$ = this._routerParamsService.params$
            .map(({ params = { pesquisa: 0 } }) => params['pesquisa'])
            .flatMap(id => id ? _pesquisaService.getPesquisa(id) : Observable.of(null));


        pesquisa$.zip(localidade$)
            .scan((acc, [pesquisa, localidade]) => Object.assign(acc, pesquisa, localidade), _initialState)
            .subscribe(state => this.notify(state));


    }


    /**
     *
     *
     * @readonly
     * @type {Observable<any>}
     * @memberOf AppState
     */
    public get observable$(): Observable<any> {

        return this._appState$;
    }

    /**
     *
     *
     * @readonly
     * @type {Localidade}
     * @memberOf AppState
     */
    public get localidade(): Localidade {

        return this._localidade;
    }

    /**
     *
     *
     * @readonly
     * @type {Pesquisa}
     * @memberOf AppState
     */
    public get pesquisa(): Pesquisa {

        return this._pesquisa;
    }

    /*
     *
     *
     * @private
     * @param {*} data
     *
     * @memberOf AppState
     */
    private notify(data: any): void {

        if (!!data) {

            this._notify.next(data);
        }
    }
}
