import { ActivatedRoute, Params } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


import { Localidade } from './localidade/localidade.interface';
import { Pesquisa } from './pesquisa/pesquisa.interface';
import { Indicador } from './pesquisa/pesquisa.interface';


import { LocalidadeService } from './localidade/localidade.service';
import { PesquisaService } from './pesquisa/pesquisa.service';
import { RouterParamsService } from './router-params.service';



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

    private _notify = new Subject<any>();
    private _appState$ = this._notify.asObservable();


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
        private _localidadeService: LocalidadeService,
        private _routerParamsService: RouterParamsService,
        private _pesquisaService: PesquisaService
    ){

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
    }    


    /**
     * 
     * 
     * @readonly
     * @type {Observable<any>}
     * @memberOf AppState
     */
    public get observable$(): Observable<any>{

        return this._appState$;
    }

    /**
     * 
     * 
     * @readonly
     * @type {Localidade}
     * @memberOf AppState
     */
    public get localidade(): Localidade{

        return this._localidade;
    }

    /**
     * 
     * 
     * @readonly
     * @type {Pesquisa}
     * @memberOf AppState
     */
    public get pesquisa(): Pesquisa{
        
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