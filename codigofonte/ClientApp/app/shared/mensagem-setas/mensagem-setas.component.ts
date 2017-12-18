import { Component } from '@angular/core';
import { TraducaoService } from '..';

@Component({
    selector: 'mensagem-setas',
    templateUrl: './mensagem-setas.component.html',
    styleUrls: ['./mensagem-setas.component.css']
})

export class MensagemSetasComponent {

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _traducaoServ: TraducaoService
    ) { }

}