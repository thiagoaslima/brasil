import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isBrowser } from 'angular2-universal';

@Component({
    selector: 'breadcrumb',
    templateUrl: 'breadcrumb.template.html',
    styleUrls: ['breadcrumb.style.css']
})
export class Breadcrumb implements OnInit, OnChanges {

    @Input() indicadores; //array linear de indicadores (já com flat aplicado)
    @Input() indicadorSelecionado; // modelo indicador selecionado
    @Input() urlBase = '';
    @Input() breadcrumb;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ){}

    ngOnChanges(){
        
    }

    ngOnInit(){
        
    }

    navegarPara(indicador){
        if (isBrowser) {
            let url = window.location.href;
            let path:any = url.split('?')[0];
            let queryParams = {};
            path = path.split('/');
            path.splice(0, path.indexOf('brasil'));
            if(url.indexOf('?') >= 0){
                let qp:any = url.split('?')[1];
                qp = qp.split('&');
                for(let i = 0; i < qp.length; i++){
                    let keyValue = qp[i].split('=');
                    queryParams[keyValue[0]] = keyValue[1];
                }
                queryParams['indicador'] = indicador;
            }
            //navega para a url
            this._router.navigate(path, {'queryParams' : queryParams});
        }
    }

}
