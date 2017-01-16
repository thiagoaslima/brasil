import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { HomeExampleComponent } from './home-example/home-example.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeExampleComponent
    ],
    imports: [
        CoreModule,
        SharedModule,

        AppRoutingModule
    ]
})
export class AppModule {
}