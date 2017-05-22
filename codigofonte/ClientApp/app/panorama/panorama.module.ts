import { NgModule } from '@angular/core';

import { PanoramaComponent } from './panorama.component';
import { PanoramaResumoComponent } from './panorama-resumo/panorama-resumo.component'
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';
import { PanoramaPainelComponent } from './panorama-painel/panorama-painel.component';
import { PanoramaCardComponent, PanoramaCardReguaComponent } from './panorama-painel/panorama-card/panorama-card.component';

import { InfografiaModule } from '../infografia/infografia.module';
import { SharedModule } from '../shared/shared.module';
import { SharedModule2 } from '../shared2/shared.module';
import { SharedModule3 } from '../shared3/shared3.module';
import { IBGECartogramaModule } from '../infografia/ibge-cartograma';

@NgModule({
    imports: [
        InfografiaModule,
        SharedModule,
        SharedModule2,
        SharedModule3,
        IBGECartogramaModule
    ],
    exports: [],
    declarations: [
        PanoramaComponent,
        PanoramaResumoComponent,
        PanoramaTemasComponent,
        PanoramaPainelComponent,
        PanoramaCardComponent,
        PanoramaCardReguaComponent
    ],
    providers: [],
})
export class PanoramaModule { }
