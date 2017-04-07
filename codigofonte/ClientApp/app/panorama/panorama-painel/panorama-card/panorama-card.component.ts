import { Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, SimpleChanges, SimpleChange } from '@angular/core';

import { Localidade, NiveisTerritoriais } from '../../../shared2/localidade/localidade.model';
import { Indicador, EscopoIndicadores } from '../../../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../../../shared2/indicador/indicador.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'panorama-card',
    templateUrl: './panorama-card.template.html',
    styleUrls: ['./panorama-card.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaCardComponent implements OnInit, OnChanges {
    @Input() dados;
    @Input() localidade;
    @Input('selecionado') isSelecionado;

    public rankingPais = '0';
    public rankingUf = '0';
    private _dados$ = new BehaviorSubject(null);
    private _localidade$ = new BehaviorSubject(null);

    constructor(
        private _indicadorService: IndicadorService2
    ) { }

    ngOnInit() { 
        const sync$ = this._dados$
            .distinct( (a, b) =>  ['pesquisaId', 'indicadorId', 'periodo'].every(key => a[key] === b[key]))
            .filter(dados => dados.pesquisaId && dados.indicadorId && dados.periodo)
            .map(dados => {
                return {
                    pesquisaId: dados.pesquisaId,
                    indicadorId: dados.indicadorId,
                    periodo: dados.periodo
                }
            })
            .combineLatest(this._localidade$)
            .map( ([obj, localidade]) => Object.assign({}, obj, { localidade: localidade }))
            .share();

        sync$
            .flatMap(obj => this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, obj.localidade))
            .subscribe(res => this.rankingPais = `${Math.round(res.ranking/res.totalItens * 100)}%`)

        sync$
            .flatMap(obj => this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, obj.localidade, obj.localidade.parent.codigo))
            .subscribe(res => this.rankingUf = `${Math.round(res.ranking/res.totalItens * 100)}%`)
            
        
        // this.uf$ = sync$
        //     .flatMap(obj => this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, obj.localidade.codigo, obj.localidade.parent.codigo))

        /*
        const base$ = sync$
            .combineLatest(this._localidade$)
            .map(([obj, localidade]) => {
                const contextoRegiao = Localidade.alterarContexto(localidade.parent.codigo, NiveisTerritoriais.macrorregiao);

                return {
                    pais: this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, localidade.codigo),
                    uf: this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, localidade.codigo, localidade.parent.codigo)
                }
            })
            .share();
            */
    }

    ngOnChanges(changes: SimpleChanges) {
       if (changes.hasOwnProperty('dados') && changes.dados.currentValue) {
            this._dados$.next(changes.dados.currentValue);
       }

       if (changes.hasOwnProperty('localidade') && changes.localidade.currentValue) {
            this._localidade$.next(changes.localidade.currentValue);
       }
    }
}