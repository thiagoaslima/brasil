import { NgModule } from '@angular/core';

import { TraducaoService, L10NPipe } from '.';

@NgModule({
    imports: [],
    exports: [
        L10NPipe
    ],
    declarations: [
        L10NPipe
    ]
})
export class TraducaoModule {
    static forRoot() {
        return {
            ngModule: TraducaoModule,
            providers: [
                TraducaoService
            ]
        }
    }
}
