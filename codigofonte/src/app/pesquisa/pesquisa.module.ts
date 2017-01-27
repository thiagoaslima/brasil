import { NgModule } from '@angular/core';

import { PesquisaComponent } from './pesquisa.component';
import {PesquisaSubmenuComponent} from './pesquisa-submenu/pesquisa-submenu.component';

import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../shared/ng2-charts.module';

@NgModule({
    imports: [
        SharedModule,
        ChartsModule
    ],
    declarations: [
        PesquisaComponent,
        PesquisaSubmenuComponent
    ]
})
export class PesquisaModule {}