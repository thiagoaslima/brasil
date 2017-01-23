import { Component, OnInit } from '@angular/core';
import { RouterParamsService } from '../shared/router-params.service';

@Component({
    selector: 'sintese',
    templateUrl: 'sintese.template.html',
})
export class SinteseComponent {

    constructor(
        private _routerParams:RouterParamsService
    ){};

    ngOnInit(){
        this._routerParams.params$.subscribe((params)=>{
            if(params.uf && params.municipio){
                //sintese município
            }else if(params.uf && !params.municipio){
                //sintese uf
            }else{
                //sintese Brasil
            }
        });
    }

}