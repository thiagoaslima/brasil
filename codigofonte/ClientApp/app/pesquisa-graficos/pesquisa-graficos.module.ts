import { NgModule } from '@angular/core';

import { SharedModule2 } from '../shared2/shared.module';
import { PesquisaGraficosComponent } from './pesquisa-graficos.component';


@NgModule({
    imports: [SharedModule2],
    exports: [PesquisaGraficosComponent],
    declarations: [PesquisaGraficosComponent],
    providers: [],
})
export class PesquisaGraficosModule { }

