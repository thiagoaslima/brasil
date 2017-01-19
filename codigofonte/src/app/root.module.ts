import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { SinteseModule } from './sintese/sintese.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';

@NgModule({
    imports: [
        CoreModule,
        SharedModule,
        SinteseModule,
        RootRoutingModule
    ],
    declarations: [
        RootComponent
    ]
})
export class RootModule {}