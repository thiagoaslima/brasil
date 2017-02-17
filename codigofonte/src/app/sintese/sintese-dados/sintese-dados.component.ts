import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { SINTESE } from '../sintese-config';
import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/pluck';

@Component({
    selector: 'sintese-dados',
    templateUrl: 'sintese-dados.template.html',
    styleUrls: ['sintese-dados.style.css']
})
export class SinteseDadosComponent implements OnInit, OnDestroy {
    @Input() content = [];
    @Input() baseURL = '';

    public conteudo = <{ tema: string, indicadores: any[] }[]>[];
    private _conteudo$$: Subscription;

    constructor(
        private _localidadeService: LocalidadeService,
        private _sinteseService: SinteseService,
        private _sinteseConfig: SINTESE
    ) { }

    ngOnInit() {
        let localidade$ = this._localidadeService.selecionada$
            .distinctUntilChanged()
            .map(localidade => {
                this.conteudo = this.resetConteudo();
                return localidade;
            });

        this._conteudo$$ = localidade$
            .distinctUntilChanged()
            .flatMap((localidade) => this._sinteseService.getConteudo(this._sinteseConfig.temas, this._sinteseConfig[localidade.tipo], localidade.codigo))
            .subscribe(item => {
                this.conteudo.filter(cont => cont.tema === item['tema']).map(cont => cont.indicadores.push(item));
            });
    }

    ngOnDestroy() {
        this._conteudo$$.unsubscribe();
    }

    trackBy(idx, item) {
        return item.id;
    }

    resetConteudo() {
        console.log('reset');
        return this._sinteseConfig.temas.map(tema => ( { tema, indicadores: [] } ))
    }

}