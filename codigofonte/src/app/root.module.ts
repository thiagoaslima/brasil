import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';

import { SharedModule } from './shared/shared.module';

import { SinteseModule } from './sintese/sintese.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';

import { ValidParametersGuard } from './valid-parameters.guard';

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
        ValidParametersGuard
    ]
})
export class RootModule {}