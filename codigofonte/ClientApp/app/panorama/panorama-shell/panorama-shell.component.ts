import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';
import { PanoramaService } from '../panorama.service';
import { PANORAMA, ItemConfiguracao } from '../configuration';
import {
    niveisTerritoriais,
    AppState,
    CacheFactory,
    SyncCache,
    LocalidadeService3, ResultadoService3
} from '../../shared';
import { converterObjArrayEmHash } from '../../../utils';


const cache = CacheFactory.createCache('configuracao', 3);

@Component({
    selector: 'panorama-shell',
    templateUrl: './panorama-shell.template.html',
    styleUrls: ['./panorama-shell.style.css']
})
export class PanoramaShellComponent implements OnInit, OnDestroy {
    public configuracao = [];
    public localidade = null;
    public resultados = [];

    public temaSelecionado = '';

    private _configuracao$$: Subscription;

    @SyncCache({
        cache: cache
    })
    static getConfiguracao(tipo) {
        const { temas, indicadores } = PANORAMA[tipo] || { temas: [], indicadores: [] };
        const hash = converterObjArrayEmHash(indicadores, 'tema', true);
        return temas.reduce((agg, tema) => agg.concat(hash[tema]), [] as ItemConfiguracao[]).filter(Boolean);
    }

    /*
     * TO DO
     * retirar localidade service quando o AppState servir a Localidade do SharedModule3
    */
    constructor(
        private _appState: AppState,
        private _panoramaService: PanoramaService,
        private _resultadoService: ResultadoService3,
        private _localidadeService: LocalidadeService3,
        private modalErrorService: ModalErrorService
    ) {
        
    }

    ngOnInit() {
        this._configuracao$$ = this._appState.notify$
            .map(state => state.localidade)
            .filter(Boolean)
            .distinctUntilChanged()
            .mergeMap(localidade => {
                const _localidade = this._localidadeService.getByCodigo(localidade.codigo, 'proprio')[0];
                let configuracao = PanoramaShellComponent.getConfiguracao(localidade.tipo);
                // let indicadoresId = configuracao.map(item => item.indicadorId).filter(Boolean);

                // this._resultadoService
                // .getResultadosCompletos(indicadoresId, localidade.codigo)
                return this._panoramaService
                    .getResultados(configuracao, _localidade)
                    .map(resultados => ({
                        configuracao: configuracao,
                        resultados: resultados,
                        localidade: _localidade
                    }));
            })
            .subscribe(({ configuracao, resultados, localidade }) => {
                this.configuracao = configuracao;
                this.resultados = resultados;
                this.localidade = localidade;
                this.temaSelecionado = '';
            }, error => {
                console.error(error);
                this.modalErrorService.showError();
            });
    }

    ngOnDestroy() {
        this._configuracao$$.unsubscribe();
    }

    handleTemaSelecionado(tema) {
        this.temaSelecionado = tema;
    }
}
