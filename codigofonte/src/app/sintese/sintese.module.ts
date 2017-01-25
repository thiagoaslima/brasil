import { NgModule } from '@angular/core';

import { SinteseComponent } from './sintese.component';
import { SinteseHeaderComponent } from './sintese-header/sintese-header.component';
import { SinteseDadosComponent } from './sintese-dados/sintese-dados.component';
import { GraficoComponent } from './grafico/grafico.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../shared/ng2-charts.module';

@NgModule({
    imports: [
        SharedModule,
        ChartsModule
    ],
    declarations: [
        SinteseComponent,
        SinteseHeaderComponent,
        SinteseDadosComponent,
        GraficoComponent
    ]
})
export class SinteseModule {}