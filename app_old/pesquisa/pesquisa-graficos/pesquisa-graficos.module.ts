import { NgModule } from '@angular/core';

import { SharedModule2 } from '../../shared2/shared.module';
import { SharedModule } from '../../shared/shared.module';
import { InfografiaModule } from '../../infografia/infografia.module';
import { PesquisaGraficosComponent } from './pesquisa-graficos.component';


@NgModule({
    imports: [SharedModule2, SharedModule, InfografiaModule],
    exports: [PesquisaGraficosComponent],
    declarations: [PesquisaGraficosComponent],
    providers: [],
})
export class PesquisaGraficosModule { }

