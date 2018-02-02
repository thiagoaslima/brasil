import { TraducaoModule } from '../traducao/traducao.module';
import { NgModule } from '@angular/core';

import { SINTESE } from './sintese-config';

import { GraficoComponent } from './grafico/grafico.component';

import { HistoricoComponent } from './historico/historico.component';
import { FotosComponent } from './fotos/fotos.component';

import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../infografia/ng2-charts.module';
import { RootRoutingModule } from '../root-routing.module';

@NgModule({
    imports: [
        SharedModule,
        ChartsModule,
        RootRoutingModule,
        TraducaoModule
    ],
    exports: [
        HistoricoComponent,
        FotosComponent
    ],
    declarations: [
        GraficoComponent,
        HistoricoComponent,
        FotosComponent
    ],
    providers: [
        SINTESE
    ]
})
export class SinteseModule { }