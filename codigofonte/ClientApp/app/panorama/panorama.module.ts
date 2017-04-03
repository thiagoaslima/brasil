import { NgModule } from '@angular/core';

import { PanoramaComponent } from './panorama.component';
import { PanoramaResumoComponent } from './panorama-resumo/panorama-resumo.component'
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';
import { PanoramaPainelComponent } from './panorama-painel/panorama-painel.component';
import { PanoramaCardComponent } from './panorama-painel/panorama-card/panorama-card.component';

import { InfografiaModule } from '../infografia/infografia.module';
import { SharedModule } from '../shared/shared.module';
import { SharedModule2 } from '../shared2/shared.module';

@NgModule({
    imports: [
        InfografiaModule,
        SharedModule,
        SharedModule2
    ],
    exports: [],
    declarations: [
        PanoramaComponent,
        PanoramaResumoComponent,
        PanoramaTemasComponent,
        PanoramaPainelComponent,
        PanoramaCardComponent
    ],
    providers: [],
})
export class PanoramaModule { }
