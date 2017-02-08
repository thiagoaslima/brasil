import { NgModule } from '@angular/core';

import { PesquisaComponent } from './pesquisa.component';
import { PesquisaSubmenuComponent } from './pesquisa-submenu/pesquisa-submenu.component';
import { PesquisaDadosComponent } from './pesquisa-dados/pesquisa-dados.component';


import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../shared/ng2-charts.module';

@NgModule({
    imports: [
        SharedModule,
        ChartsModule
    ],
    declarations: [
        PesquisaComponent,
        PesquisaSubmenuComponent,
        PesquisaDadosComponent
    ]
})
export class PesquisaModule {}