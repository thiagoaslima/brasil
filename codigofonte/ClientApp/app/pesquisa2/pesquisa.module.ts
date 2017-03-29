import { NgModule } from '@angular/core';

import { SharedModule2 } from '../shared2/shared.module';
import { PesquisaComponent2 } from './pesquisa.component';
import { PesquisaHeaderComponent } from './pesquisa-header/pesquisa-header.component';
import { PesquisaTabelaComponent } from './pesquisa-tabela/pesquisa-tabela.component';
import { PesquisaLinhaTabelaComponent } from './pesquisa-tabela/pesquisa-linha-tabela/pesquisa-linha-tabela.component';
@NgModule({
    imports: [
        SharedModule2
    ],
    exports: [],
    declarations: [
        PesquisaLinhaTabelaComponent,
        PesquisaTabelaComponent,
        PesquisaHeaderComponent,
        PesquisaComponent2
    ],
    providers: [],
})
export class PesquisaModule2 { }
