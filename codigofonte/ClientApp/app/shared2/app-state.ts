import { ActivatedRoute, Params } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';


import { Localidade, NiveisTerritoriais } from '../shared2/localidade/localidade.model';
import { Pesquisa } from '../shared2/pesquisa/pesquisa.model';
import { Indicador } from '../shared2/indicador/indicador.model';


import { LocalidadeService2 } from '../shared2/localidade/localidade.service';
import { PesquisaService2 } from '../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../shared/router-params.service';


const _initialState = {
    pesquisa: null,
    localidade: null,
    tipo: ''
}
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
    private _urlParams;
    private _queryParams;

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
        private _localidadeService: LocalidadeService2,
        private _pesquisaService: PesquisaService2
    ) {
        const localidade$ = this._routerParamsService.params$
            .map(({ params = { uf: '', municipio: '' } }) => {
                let { uf, municipio } = params;

                if (municipio) {
                    return {
                        localidade: _localidadeService.getMunicipioBySlug(uf, municipio),
                        tipo: NiveisTerritoriais.municipio.label
                    }
                }

                if (uf) {
                    return {
                        localidade: _localidadeService.getUfBySigla(uf),
                        tipo: NiveisTerritoriais.uf.label
                    }
                }

                return {
                    localidade: _localidadeService.getRoot(),
                    tipo: NiveisTerritoriais.pais.label
                }
            });

        const pesquisa$ = this._routerParamsService.params$
            .map(({ params = { pesquisa: 0 } }) => params['pesquisa'])
            .flatMap(id => id ? _pesquisaService.getPesquisa(id): Observable.of(null));

        // Observable.merge(
        //     pesquisa$, localidade$
        // ).forEach(console.log.bind(console, 'teste'));


        pesquisa$.merge(localidade$)
            .scan((acc, obj) => Object.assign(acc, obj), _initialState)
            .subscribe(state => this.notify(state));

        /*
        this._routerParamsService.params$
            .flatMap(({ urlParams, queryParams }) =>  _pesquisaService.getPesquisa(urlParams['pesquisa']))
            .combineLatest(this._localidadeService.selecionada$)
            .subscribe(([pesquisa, localidade]) => {

                this._localidade = localidade;
                this._pesquisa = pesquisa;

                this.notify({
                    "localidade": localidade,
                    "pesquisa": pesquisa
                });
            });  
            */
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