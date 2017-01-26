import { NgModule } from '@angular/core';

import { SinteseComponent } from './sintese.component';
import { SinteseHeaderComponent } from './sintese-header/sintese-header.component';
import { SinteseDadosComponent } from './sintese-dados/sintese-dados.component';
import { SinteseDetalhesComponent } from './sintese-detalhes/sintese-detalhes.component';
import { SinteseGraficoComponent } from './sintese-grafico/sintese-grafico.component';
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
        SinteseDetalhesComponent,
        SinteseGraficoComponent
    ]
})
export class SinteseModule {}