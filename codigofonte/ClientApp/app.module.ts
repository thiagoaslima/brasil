import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { CommonModule }  from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './app/shared2/shared.module';
import { TesteModule } from './app/testes/testes.module';
import { AppComponent } from './app/app/app.component';
import { rootRouting } from './app/root.routes';


@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        CommonModule,
        RouterModule,
        rootRouting,
        SharedModule.forRoot(),
        TesteModule
    ],
    providers: [
    ]
})
export class AppModule {
}
