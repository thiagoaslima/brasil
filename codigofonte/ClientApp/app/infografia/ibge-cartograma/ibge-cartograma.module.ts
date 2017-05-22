import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { SharedModule2 } from '../../shared2/shared.module';

import { IBGECartograma } from './ibge-cartograma.component';
import { MapaService } from './mapa.service';

@NgModule({
    imports: [
        SharedModule,
        SharedModule2
    ],
    declarations: [
        IBGECartograma
    ],
    exports: [
        IBGECartograma
    ],
    providers: [
        MapaService
    ]
})
export class IBGECartogramaModule {

}