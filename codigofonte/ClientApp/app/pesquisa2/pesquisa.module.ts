import { NgModule } from '@angular/core';

import { PesquisaComponent } from './pesquisa.component';
import { PesquisaHeaderComponent } from './pesquisa-header/pesqusa-header.component';
import { PesquisaTabelaComponent } from './pesquisa-tabela/pesquisa-tabela.component';
import { PesquisaLinhaTabelaComponent } from './pesquisa-tabela/pesquisa-linha-tabela/pesquisa-linha-tabela.component';
@NgModule({
    imports: [],
    exports: [],
    declarations: [
        PesquisaLinhaTabelaComponent,
        PesquisaTabelaComponent,
        PesquisaHeaderComponent,
        PesquisaComponent
    ],
    providers: [],
})
export class PesquisaModule { }
