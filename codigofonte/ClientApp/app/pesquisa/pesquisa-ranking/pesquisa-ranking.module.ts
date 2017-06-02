import { IBGECartogramaModule } from '../../infografia/ibge-cartograma';
import { InfografiaModule } from '../../infografia/infografia.module';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';

import { SharedModule2 } from '../../shared2/shared.module';
import { PesquisaRankingComponent } from './pesquisa-ranking.component';


@NgModule({
    imports: [SharedModule2, SharedModule, InfografiaModule, IBGECartogramaModule],
    exports: [PesquisaRankingComponent],
    declarations: [PesquisaRankingComponent],
    providers: [],
})
export class PesquisaRankingModule { }