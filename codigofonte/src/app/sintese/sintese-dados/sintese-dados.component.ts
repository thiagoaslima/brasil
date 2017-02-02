import { Component, OnInit, OnDestroy } from '@angular/core';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { Localidade } from '../../shared/localidade/localidade.interface';

import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'sintese-dados',
    templateUrl: 'sintese-dados.template.html',
    styleUrls: ['sintese-dados.style.css']
})
export class SinteseDadosComponent implements OnInit, OnDestroy {
    public content = null;
    public baseURL;

    private _subscription: Subscription;

    constructor(
        private sinteseService: SinteseService,
        private localidadeService: LocalidadeService
    ) { }

    ngOnInit() {

         this._subscription = this.localidadeService.selecionada$
            .flatMap(localidade => {

                this.baseURL = localidade.link;
                /*
                if(localidade.tipo = 'municipio') {

                    // 'brasil/:uf/:municipio'
                    this.baseURL = '/brasil/' + this.localidadeService.getUfByCodigo( (<Municipio>localidade).codigoUf ).sigla.toLowerCase() + '/' + localidade.slug;

                } else if (localidade instanceof UF) {

                    // 'brasil/:uf'
                    this.baseURL = '/brasil/' + (<UF>localidade).sigla.toLowerCase();
                    
                } else {

                    this.baseURL = '/brasil';
                }
                */

                return this.sinteseService.getSinteseLocal(localidade.codigo.toString())
            } ) 
            .subscribe(dados => this.content = dados);

    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}