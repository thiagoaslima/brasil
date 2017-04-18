import { Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, SimpleChanges, SimpleChange } from '@angular/core';

import { Localidade, NiveisTerritoriais } from '../../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../../shared2/localidade/localidade.service';
import { Indicador, EscopoIndicadores } from '../../../shared2/indicador/indicador.model';
import { IndicadorService2 } from '../../../shared2/indicador/indicador.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
    private _dados$ = new BehaviorSubject(null);
    private _localidade$ = new BehaviorSubject(null);

    mostrarNotas = false;
    mostrarFontes = false;

    constructor(
        private _localidadeService: LocalidadeService2,
        private _indicadorService: IndicadorService2,
        private _router: Router
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
            // .share();

        this.rankingPais$ = sync$
            .flatMap(obj => this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, obj.localidade.codigo, 'BR'))
            .share();
            
        this.lengthPais = this._localidadeService.getAllMunicipios().length;
        
            
        this.lengthUf$ = this._localidade$.map((localidade: Localidade) => localidade.parent.children.length);
        this.rankingUf$ = sync$
            .flatMap(obj => this._indicadorService.getPosicaoRelativa(obj.pesquisaId, obj.indicadorId, obj.periodo, obj.localidade.codigo, obj.localidade.parent.codigo))
            .share()
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
}

@Component({
    selector: 'panorama-card-regua',
    styleUrls: ['./panorama-card.style.css'],
    template:`
        <div class="card__regua-comparacao">
            <p>{{title}}</p>
            <div class="card__regua-comparacao__regua" [class.card__regua-comparacao__regua--desabilitada]="!ranking" [attr.pos]="posicao" [attr.len]="itens" [attr.ranking]="ranking">
                <div [ngStyle]='{right: cssRanking}' class="card__regua-comparacao__regua__marcador"></div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaCardReguaComponent implements OnChanges {
    @Input() posicao;
    @Input() itens;
    @Input() title;

    public ranking ;
    public cssRanking;

    ngOnChanges(changes: SimpleChanges) {
        if (this.posicao && this.itens) {
            this.ranking = `${(this.posicao/this.itens * 100).toFixed(2)}%`;
            this.cssRanking = `${((this.posicao/this.itens * 100) * 96 / 100 ).toFixed(2)}%`;
        }
    }
}