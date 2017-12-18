import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SINTESE } from './sintese-config';

import { GraficoComponent } from './grafico/grafico.component';

import { HistoricoComponent } from './historico/historico.component';
import { FotosComponent } from './fotos/fotos.component';

import { SinteseService } from './sintese.service';

import { SharedModule } from '../../shared/';
import { ChartsModule } from '../../infografia/ng2-charts.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ChartsModule,
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
        SINTESE,
        SinteseService
    ]
})
export class SinteseModule { }