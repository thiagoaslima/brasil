import { Component, EventEmitter, Input, Output, OnInit, OnChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

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

    isBrowser;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        @Inject(PLATFORM_ID) platformId,
    ){
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnChanges(){
        
    }

    ngOnInit(){
        
    }

    navegarPara(indicador){
        if (this.isBrowser) {
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
