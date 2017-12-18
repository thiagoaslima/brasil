import { RouterModule } from '@angular/router';
import { IBGECartogramaModule } from '../../../infografia/ibge-cartograma';
import { InfografiaModule } from '../../../infografia/infografia.module';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared';
import { PesquisaRankingComponent } from './pesquisa-ranking.component';


@NgModule({
    imports: [RouterModule, SharedModule, InfografiaModule, IBGECartogramaModule],
    exports: [PesquisaRankingComponent],
    declarations: [PesquisaRankingComponent],
    providers: [],
})
export class PesquisaRankingModule { }