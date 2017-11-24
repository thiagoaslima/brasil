import { TraducaoService } from './traducao.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'l10n'
})

export class L10NPipe implements PipeTransform {
    constructor(
        private _traducaoServ: TraducaoService
    ) { }

    transform(value: any, lang: string): string {
        return this._traducaoServ.L10N(lang)[value];
    }
}