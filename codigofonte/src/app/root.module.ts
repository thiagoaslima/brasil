import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { RootComponent } from './root.component';

@NgModule({
    imports: [
        CoreModule,
        SharedModule
    ],
    declarations: [
        RootComponent
    ]
})
export class RootModule {}