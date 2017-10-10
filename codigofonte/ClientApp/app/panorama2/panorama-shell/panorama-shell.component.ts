import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';
import { Panorama2Service } from '../panorama.service';
import { niveisTerritoriais } from '../../shared3/values';
import { AppState } from '../../shared2/app-state';
import { PANORAMA, ItemConfiguracao } from '../configuration';
import { CacheFactory } from '../../cache/cacheFactory.service';
import { SyncCache } from '../../cache/decorators';
import { converterObjArrayEmHash } from '../../utils2';
import { LocalidadeService3, ResultadoService3 } from '../../shared3/services';


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
        private _panoramaService: Panorama2Service,
        private _resultadoService: ResultadoService3,
        private _localidadeService: LocalidadeService3,
        private modalErrorService: ModalErrorService
    ) { }

    ngOnInit() {
        this._configuracao$$ = this._appState.observable$
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
            }, error => this.modalErrorService.showError());
    }

    ngOnDestroy() {
        this._configuracao$$.unsubscribe();
    }

    handleTemaSelecionado(tema) {
        this.temaSelecionado = tema;
    }
}
