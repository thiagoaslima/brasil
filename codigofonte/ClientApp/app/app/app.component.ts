import { Component } from '@angular/core';

import { IndicadorService } from '../shared2/indicador/indicador.service';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {

    constructor(
        private _indicadorService: IndicadorService
    ) {}
}
