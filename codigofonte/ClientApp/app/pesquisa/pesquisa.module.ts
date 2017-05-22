import { PesquisaIndicadoresComponent } from './pesquisa-indicadores/pesquisa-indicadores.component';
import { NgModule } from '@angular/core';

import { SharedModule2 } from '../shared2/shared.module';
import { PesquisaComponent } from './pesquisa.component';
import { PesquisaHeaderComponent, BuscaHeaderComponent } from './pesquisa-header/pesquisa-header.component';
import { PesquisaTabelaComponent } from './pesquisa-tabela/pesquisa-tabela.component';
import { PesquisaCartogramaModule } from './pesquisa-cartograma/pesquisa-cartograma.module';
import { PesquisaGraficosModule } from './pesquisa-graficos/pesquisa-graficos.module';
import { PesquisaRankingModule } from './pesquisa-ranking/pesquisa-ranking.module';

@NgModule({
    imports: [
        SharedModule2,
        PesquisaRankingModule,
        PesquisaGraficosModule,
        PesquisaCartogramaModule
    ],
    declarations: [
        PesquisaTabelaComponent,
        PesquisaHeaderComponent,
        BuscaHeaderComponent,
        PesquisaComponent,
        PesquisaIndicadoresComponent
    ],
    providers: [],
})
export class PesquisaModule2 { }