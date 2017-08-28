import { Observable } from 'rxjs/Rx';
import { IndicadoresService } from './indicadores.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'panorama-brasil',
    templateUrl: 'panorama-brasil.component.html'
})
export class PanoramaBrasilComponent implements OnInit {
    teste = 'Teste Panorama Brasil';

    dados: any = {};

    constructor(
        private _indicadoresServ: IndicadoresService
    ) {}

    public ngOnInit(): void {
        let indicadores = Object.keys(IndicadoresService.INDICADORES).map((indicador) => {
            return this._indicadoresServ.getIndicadores(indicador, 12);
        });

        Observable.zip(...indicadores).subscribe(indicadores => {
            debugger;
            this.dados.indicadores = indicadores;
        });


    }
}
