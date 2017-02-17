import { NgModule } from '@angular/core';

import { SINTESE } from './sintese-config';
import { SinteseComponent } from './sintese.component';
import { SinteseHeaderComponent } from './sintese-header/sintese-header.component';
import { SinteseDadosComponent } from './sintese-dados/sintese-dados.component';
import { SinteseDetalhesComponent } from './sintese-detalhes/sintese-detalhes.component';

import { GraficoComponent } from './grafico/grafico.component';
import { TabelaComponent } from './tabela/tabela.component';
import { HistoricoComponent } from './historico/historico.component';
import { FotosComponent } from './fotos/fotos.component';

import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../shared/ng2-charts.module';
import { MapaComponent } from './mapa/mapa.component';
import { RootRoutingModule } from '../root-routing.module';

@NgModule({
    imports: [
        SharedModule,
        ChartsModule,
        RootRoutingModule
    ],
    declarations: [
        SinteseComponent,
        SinteseHeaderComponent,
        SinteseDadosComponent,
        SinteseDetalhesComponent,
        HistoricoComponent,
        FotosComponent,
        GraficoComponent,
        TabelaComponent,
        MapaComponent
    ],
    providers: [
        SINTESE
    ]
})
export class SinteseModule { }