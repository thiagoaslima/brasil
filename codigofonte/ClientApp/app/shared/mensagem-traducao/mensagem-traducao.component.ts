import { TraducaoService } from '../../traducao/traducao.service';
import { Component } from '@angular/core';

@Component({
    selector: 'mensagem-traducao',
    templateUrl: './mensagem-traducao.component.html',
    styleUrls: ['./mensagem-traducao.component.css']
})

export class MensagemTraducaoComponent {

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _traducaoServ: TraducaoService
    ) { }

}