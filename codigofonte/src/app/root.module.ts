import { NgModule, OpaqueToken } from '@angular/core';

import { CoreModule } from './core/core.module';

import { SharedModule } from './shared/shared.module';

import { SinteseModule } from './sintese/sintese.module';
import { PesquisaModule } from './pesquisa/pesquisa.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';

import { ValidParametersGuard } from './valid-parameters.guard';
import { BASES, PESQUISAS } from './global-config';

@NgModule({
    imports: [
        CoreModule,
        SharedModule,
        SinteseModule,
        SandboxModule,
        RootRoutingModule
    ],
    declarations: [
        RootComponent
    ],
    providers: [
        ValidParametersGuard,
        PESQUISAS,
        BASES
    ]
})
export class RootModule { }