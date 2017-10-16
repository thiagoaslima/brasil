import { L10NPipe } from './l10n.pipe';
import { NgModule } from '@angular/core';

import { TraducaoService } from './traducao.service';

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
