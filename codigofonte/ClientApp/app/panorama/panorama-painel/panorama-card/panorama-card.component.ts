import { log } from 'util';
import { Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, SimpleChanges, SimpleChange } from '@angular/core';

import { isBrowser } from 'angular2-universal'

import { Localidade, NiveisTerritoriais } from '../../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../../shared2/localidade/localidade.service';
import { Indicador, EscopoIndicadores } from '../../../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../../../shared2/indicador/indicador.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PesquisaConfiguration } from '../../../shared2/pesquisa/pesquisa.configuration';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/combineLatest';

// TODO: Refatorar, o AsyncPipe do PanoramaCardComponent está consumindo cerca de 0,6 segundos
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

    public rankingPais$;
    public lengthPais;
    public rankingUf$;
    public lengthUf$;
    public rankingMicrorregiao$;
    private _dados$ = new BehaviorSubject(null);
    private _localidade$ = new BehaviorSubject(null);

    public isBrowser = isBrowser;

    mostrarNotas = false;
    mostrarFontes = false;

    constructor(
        private _localidadeService: LocalidadeService2,
        private _indicadorService: IndicadorService2,
        private _router: Router,
        private _pesquisasConfig: PesquisaConfiguration
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

        const ranking$ = sync$
            .flatMap(obj => {
                return this._indicadorService.getRankings([obj.indicadorId], [obj.periodo], obj.localidade.codigo, ['BR',  obj.localidade.parent.codigo])
                .map(array => [array, obj.localidade])
            })
            .share();

        this.rankingPais$ = ranking$
            .map(([array, _]) => array.find(item => item.contexto === 'BR'))
            .share();
            
        this.lengthPais = this._localidadeService.getAllMunicipios().length;
            
        this.lengthUf$ = this._localidade$.map((localidade: Localidade) => localidade.parent.children.length);
        
        this.rankingUf$ = ranking$
            .map(([array, localidade]) => array.find(item => item.contexto === localidade.parent.codigo.toString()))
            .share();
            
        this.rankingMicrorregiao$ = sync$
            .flatMap(obj => this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, obj.localidade.codigo, obj.localidade.microrregiao))
            .share();
    }

    ngOnChanges(changes: SimpleChanges) {
       if (changes.hasOwnProperty('dados') && changes.dados.currentValue) {
            this._dados$.next(changes.dados.currentValue);
       }

       if (changes.hasOwnProperty('localidade') && changes.localidade.currentValue) {
            this._localidade$.next(changes.localidade.currentValue);
       }
    }

    navegarTabela(){
        let url = this.localidade.link + '/pesquisa/' + this.dados.pesquisaId + '/' + this.dados.indicadorId;
        // console.log('$$$$$$$$$$$$$$$$$$$$$', this.dados, url);
        this._router.navigate(url.split('/'), {'queryParams' : {ano : this.dados.periodo}});
    }

    getRankingPosition(contexto) {
        if (!contexto || !this.dados || !this.dados.ranking) {
            return ''
        }

        return this.dados.ranking[contexto].ranking
    }

    getRankingItems(contexto) {
        if (!contexto || !this.dados || !this.dados.ranking) {
            return ''
        }
        
        return this.dados.ranking[contexto].qtdeItensComparados;
    }
}

@Component({
    selector: 'panorama-card-regua',
    styleUrls: ['./panorama-card.style.css'],
    template:`
        <div class="card__regua-comparacao">
            <p>{{title}}</p>
            <div class="card__regua-comparacao__regua" [class.card__regua-comparacao__regua--desabilitada]="!ranking" [attr.pos]="this.rankingObj?.ranking" [attr.len]="itens" [attr.ranking]="ranking">
                <div [ngStyle]='{right: cssRanking}' [title]="getTitle()" class="card__regua-comparacao__regua__marcador"></div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaCardReguaComponent implements OnChanges {
    @Input('ranking') rankingObj;
    @Input() itens;
    @Input() title;
    @Input() maiorMelhor = true;

    public ranking ;
    public cssRanking;

    ngOnChanges(changes: SimpleChanges) {

        if (this.rankingObj && this.itens) {
            this.ranking = this.rankingObj.ranking/this.rankingObj.qtdeItensComparados * 100;
            if(!this.maiorMelhor)
                this.ranking = 100 - this.ranking;
            this.ranking = this.ranking.toFixed(2) + '%';

            //ajusta o ranking do css que deve ir de 0 a 96 para não quebrar o posicionamento do marcador na régua
            this.cssRanking = this.rankingObj.ranking/this.rankingObj.qtdeItensComparados * 96;
            if(!this.maiorMelhor)
                this.cssRanking = 96 - this.cssRanking;
            this.cssRanking = this.cssRanking.toFixed(2) + '%';
        } else {
            this.ranking = null;
            this.cssRanking = null;
        }
    }

    getTitle() {
        if (!this.rankingObj) {
            return null
        }

        const valor = this.maiorMelhor ? this.rankingObj.ranking : (this.rankingObj.qtdeItensComparados - this.rankingObj.ranking);
        return valor + ' de ' + this.itens 
    }
}