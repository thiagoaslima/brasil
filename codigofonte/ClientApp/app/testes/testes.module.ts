import { NgModule } from '@angular/core';

import { SharedModule } from '../shared2/shared.module';
import { TestesComponent } from './testes/testes.component';
import { LocalidadeTesteComponent } from './localidade/localidade-teste.component';
import { PesquisaTesteComponent, ListaIndicadoresTesteComponent } from './pesquisa/pesquisa-teste.component';
import { ResultadoTesteComponent } from './resultado/resultado-teste.component';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        TestesComponent,
        LocalidadeTesteComponent,
        PesquisaTesteComponent,
        ListaIndicadoresTesteComponent,
        ResultadoTesteComponent
    ],
    exports: []
})
export class TesteModule {}