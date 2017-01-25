import { Component, OnInit, OnDestroy } from '@angular/core';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'sintese-dados',
    templateUrl: 'sintese-dados.template.html',
    styleUrls: ['sintese-dados.style.css']
})
export class SinteseDadosComponent implements OnInit, OnDestroy {
    public content = null;
    private _subscription: Subscription;
    
    constructor(
        private sinteseService: SinteseService,
        private localidadeService: LocalidadeService
    ) {}

    ngOnInit() {
        console.log('init');
         this._subscription = this.localidadeService.selecionada$
            //.do(resp => console.log(resp))
            .flatMap(localidade => {return this.sinteseService.getSinteseLocal(localidade.codigo.toString())})
            .subscribe(dados => this.content = dados);
    }

    ngOnDestroy() {
        //console.log('destroy');
        this._subscription.unsubscribe();
    }

}