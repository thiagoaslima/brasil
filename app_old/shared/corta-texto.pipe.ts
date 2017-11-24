import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cortaTexto'
})
export class CortaTextoPipe implements PipeTransform {

    transform(value: any, max: number): any {

        return String(value).slice(0, max).trim() + '...';
    }
}