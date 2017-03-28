import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Pesquisa, Periodo } from '../../shared2/pesquisa/pesquisa.model';
import { PesquisaService } from '../../shared2/pesquisa/pesquisa.service';
import { Indicador } from '../../shared2/indicador/indicador.model';
import { IndicadorService } from '../../shared2/indicador/indicador.service';
import { ResultadoService } from '../../shared2/resultado/resultado.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/pluck';

@Component({
    selector: 'pesquisa-teste',
    templateUrl: 'pesquisa-teste.template.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PesquisaTesteComponent implements OnInit {
    pesquisas$: Observable<Pesquisa[]>;
    pesquisa$: Observable<Pesquisa>;
    subscription

    constructor(
        private _route: ActivatedRoute,
        private _pesquisaService: PesquisaService,
        private _indicadorService: IndicadorService,
        private _resultadoService: ResultadoService
    ) { }

    ngOnInit() {
        this._indicadorService.prefetchResultados(true, 330455);
        this.pesquisas$ = this._pesquisaService.getAllPesquisas();
        this.subscription = this._route.params.pluck('pesquisa')
            .subscribe((id: string) => this.pesquisa$ = this._pesquisaService.getPesquisa(parseInt(id) || 13));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

@Component({
    selector: 'lista-indicadores',
    template: `
        <ol>
            <li *ngFor="let indicador of indicadores">
                {{ indicador.nome }} [<small>{{ indicador.id }}</small>] | {{ (indicador.getResultadoByLocal(330455) | async)?.periodoValidoMaisRecente }}: {{ (indicador.getResultadoByLocal(330455) | async)?.valorValidoMaisRecente }}
        
                <lista-indicadores [lista]="indicador.indicadores | async">
                </lista-indicadores>
            </li>
        </ol>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaIndicadoresTesteComponent {
    @Input('lista') indicadores: Indicador[]

}