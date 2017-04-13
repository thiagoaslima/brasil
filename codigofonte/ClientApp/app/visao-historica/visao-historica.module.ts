import { NgModule } from '@angular/core';

import { VisaoHistoricaComponent } from './visao-historica.component';
import { SinteseModule } from '../sintese/sintese.module'


@NgModule({
    imports: [
        SinteseModule
    ],
    exports: [
        VisaoHistoricaComponent
    ],
    declarations: [
        VisaoHistoricaComponent
    ],
    providers: [],
})
export class VisaoHistoricaModule { }
