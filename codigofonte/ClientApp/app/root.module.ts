import { NgModule, OpaqueToken } from '@angular/core';

import { CoreModule } from './core/core.module';

import { SharedModule } from './shared/shared.module';
import { SharedModule2 } from './shared2/shared.module';

import { SinteseModule } from './sintese/sintese.module';
import { PanoramaModule } from './panorama/panorama.module'
import { PesquisaModule2 } from './pesquisa2/pesquisa.module';
import { PesquisaModule } from './pesquisa/pesquisa.module';
import { PesquisaService } from './shared/pesquisa/pesquisa.service.2';
import { SandboxModule } from './sandbox/sandbox.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';
import { TesteModule } from './testes/testes.module';

import { ValidParametersGuard } from './valid-parameters.guard';
import { BASES, PESQUISAS } from './global-config';

@NgModule({
    imports: [
        CoreModule,
        SharedModule.forRoot(),
        SharedModule2.forRoot(),
        PesquisaModule,
        PesquisaModule2,
        SinteseModule,
        PanoramaModule,
        SandboxModule,  
        RootRoutingModule,
        TesteModule
    ],
    declarations: [
        RootComponent
    ],
    exports: [
        RootComponent
    ],
    providers: [
        ValidParametersGuard,
        PESQUISAS,
        BASES
    ]
})
export class RootModule { }