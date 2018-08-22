import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EmptyComponent } from './empty.component';
import { DumpComponent } from "./dump/dump.component";
import { SinteseModule } from "./panorama/sintese/sintese.module";
import { Dump2Component } from "./dump/dump2.component";

// import { RootRoutingModule } from './root-routing.module';
// import { RootModule } from './root.module';

// import { ValidParametersGuard } from './valid-parameters.guard';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        EmptyComponent,
        DumpComponent,
        Dump2Component
    ],
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        CoreModule,
        AppRoutingModule,
        SharedModule.forRoot()  ,
        SinteseModule      
    ],
    providers: [
        // ValidParametersGuard
    ]
})
export class AppModuleShared {
}
