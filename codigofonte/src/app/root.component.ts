import { Component } from '@angular/core';
import { LocalidadeService } from './shared/localidade/localidade.service';

@Component({
    selector: 'root',
    templateUrl: 'root.template.html'
})
export class RootComponent {
    constructor(
        private localidadeService: LocalidadeService
    ) {
        localidadeService.log();
    }
}