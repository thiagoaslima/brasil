import { EmptyComponent } from './empty.component';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
// import { RootRoutingModule } from './root-routing.module';
// import { RootModule } from './root.module';

// import { ValidParametersGuard } from './valid-parameters.guard';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        CoreModule,
        AppRoutingModule,
        SharedModule.forRoot(),
    ],
    providers: [
        // ValidParametersGuard
    ]
})
export class AppModuleShared {
}
