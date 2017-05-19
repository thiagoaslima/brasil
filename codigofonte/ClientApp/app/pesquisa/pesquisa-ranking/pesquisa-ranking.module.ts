import { NgModule } from '@angular/core';

import { SharedModule2 } from '../../shared2/shared.module';
import { PesquisaRankingComponent } from './pesquisa-ranking.component';


@NgModule({
    imports: [SharedModule2],
    exports: [PesquisaRankingComponent],
    declarations: [PesquisaRankingComponent],
    providers: [],
})
export class PesquisaRankingModule { }