import { NgModule } from '@angular/core';

import { PanoramaComponent } from './panorama.component';
import { PamoramaResumoComponent } from './panorama-resumo/panorama-resumo.component'
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';
import { PanoramaCardComponent } from './panorama-temas/panorama-card/panorama-card.component';

@NgModule({
    imports: [],
    exports: [],
    declarations: [
        PanoramaComponent,
        PamoramaResumoComponent,
        PanoramaTemasComponent,
        PanoramaCardComponent
    ],
    providers: [],
})
export class PanoramaModule { }
