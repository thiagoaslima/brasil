import { NgModule } from '@angular/core';

import { PesquisaCartogramaComponent } from './pesquisa-cartograma.component';

import { InfografiaModule } from '../../../infografia/infografia.module';
import { IBGECartogramaModule } from '../../../infografia/ibge-cartograma/ibge-cartograma.module';

import {
    TraducaoModule,
    SharedModule
} from '../../../shared';



@NgModule({
    imports: [SharedModule, InfografiaModule, IBGECartogramaModule, TraducaoModule],
    exports: [PesquisaCartogramaComponent],
    declarations: [PesquisaCartogramaComponent],
    providers: [],
})
export class PesquisaCartogramaModule { }