import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared';
import { InfografiaModule } from '../../../infografia/infografia.module';
import { PesquisaGraficosComponent } from './pesquisa-graficos.component';


@NgModule({
    imports: [SharedModule, InfografiaModule],
    exports: [PesquisaGraficosComponent],
    declarations: [PesquisaGraficosComponent],
    providers: [],
})
export class PesquisaGraficosModule { }

