import { TraducaoService } from '../traducao/traducao.service';
import { Component } from '@angular/core';

@Component({
    selector: 'mensagem-traducao',
    template: `<p *ngIf="false" class="mensagem">{{ 'mensagem_traducao__mensagem' | l10n:lang }}</p>`,
    styles: [`.mensagem{
    font-size: 0.9em;
    background-color: #E6E6E6;
    padding: 10px 0px 10px 0px;
    text-align: center;
}`]
})

export class MensagemTraducaoComponent {

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _traducaoServ: TraducaoService
    ) { }

}
