import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared';

import { IBGECartograma } from './ibge-cartograma.component';
import { MapaService } from './mapa.service';

@NgModule({
    imports: [
        SharedModule,
        CommonModule
    ],
    declarations: [
        IBGECartograma
    ],
    exports: [
        IBGECartograma
    ]
})
export class IBGECartogramaModule {
    static forRoot() {
        return {
            ngModule: IBGECartogramaModule,
            providers: [
                MapaService
            ]
        }
    }
}