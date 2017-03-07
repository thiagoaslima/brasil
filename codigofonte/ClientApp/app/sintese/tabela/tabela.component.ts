import { Component, Input, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { isBrowser } from 'angular2-universal';

import { SinteseService } from '../sintese.service';
import { CommonService } from '../../shared/common.service';

import { Observable, Subscription } from 'rxjs';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

@Component({
    selector: 'tabela',
    templateUrl: 'tabela.template.html',
    styleUrls: [ 'tabela.style.css' ]
})
export class TabelaComponent implements OnInit, OnChanges, OnDestroy{

    @ViewChild("tabela1") tabelaRef : ElementRef;
  
    public isBrowser = isBrowser;
    
    public datasets = [];
    public labels;

    @Input() dados = [];
    @Input() nomeSerie = '';

    private _subscription: Subscription;
    
    
    constructor( private _commonService: CommonService ){ }

    ngOnInit() {  
        
        this.labels = null;
        this.labels = [];

        this._subscription = this._commonService.notifyObservable$.subscribe((res) => {

            if (res.hasOwnProperty('option')) {

                if(res.option === 'getDataURL'){

                    this._commonService.notifyOther({option: 'dataURL', url: this.tabelaRef.nativeElement.toDataURL()});
                }
            }

        });

        this.plotTable();
    }

    ngOnChanges(changes){

        this.labels = null;
        this.labels = [];        

        this.plotTable();
    }

    ngOnDestroy() {

        this._subscription.unsubscribe();
    }

    private plotTable(){

        let dadosGrafico:string[] = [];
        for(var i in this.dados) {

            dadosGrafico.push(this.dados[i]);
            this.labels.push(i);
        }

        let valores = dadosGrafico.map(valor => {

            return !!valor? Number(valor.replace(',', '.')) : Number(valor);
        });

        this.datasets = [{data: valores, label: this.nomeSerie}];
    }

       

}