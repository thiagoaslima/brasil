import { NgModule } from '@angular/core';

import { LazyExampleComponent } from './lazy-example.component';
import { LazyExampleRoutingModule } from './lazy-example.routing';

@NgModule({
    imports: [
        LazyExampleRoutingModule
    ],
    declarations: [
        LazyExampleComponent
    ],
    exports: [
        LazyExampleComponent
    ]
})
export class LazyExampleModule { }