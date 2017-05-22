import { NgModule } from '@angular/core';

import { SharedModule2 } from '../../shared2/shared.module';
import { SharedModule } from '../../shared/shared.module';
import { InfografiaModule } from '../../infografia/infografia.module';
import { PesquisaCartogramaComponent } from './pesquisa-cartograma.component';


@NgModule({
    imports: [SharedModule2, SharedModule, InfografiaModule],
    exports: [PesquisaCartogramaComponent],
    declarations: [PesquisaCartogramaComponent],
    providers: [],
})
export class PesquisaCartogramaModule { }