import { NgModule } from '@angular/core';

import { SharedModule2 } from '../shared2/shared.module';
import { PesquisaCartogramaComponent } from './pesquisa-cartograma.component';


@NgModule({
    imports: [SharedModule2],
    exports: [PesquisaCartogramaComponent],
    declarations: [PesquisaCartogramaComponent],
    providers: [],
})
export class PesquisaCartogramaModule { }