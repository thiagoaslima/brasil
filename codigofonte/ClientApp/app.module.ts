import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { CommonModule }  from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app/app/app.component';
import { RootRoutingModule } from './app/root-routing.module';
import { RootModule } from './app/root.module';

import { ValidParametersGuard } from './app/valid-parameters.guard';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        CommonModule,
        RouterModule,
        RootRoutingModule,
        RootModule
    ],
    providers: [
        ValidParametersGuard
    ]
})
export class AppModule {
}
