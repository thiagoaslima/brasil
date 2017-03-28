import { NgModule } from '@angular/core';

import { ServidorPesquisas } from './configuration/servidor.configuration';
import { PesquisasConfiguration } from './configuration/pesquisas.configuration';
import { PesquisaService } from './pesquisa.service';

@NgModule({
    providers: [
        PesquisasConfiguration,
        PesquisaService,
        ServidorPesquisas
    ]
})
export class PesquisaModule {}