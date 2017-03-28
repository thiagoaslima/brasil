import { NgModule } from '@angular/core';

import { PanoramaComponent } from './panorama.component';
import { PamoramaResumoComponent } from './panorama-resumo/panorama-resumo.component'
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';

@NgModule({
    imports: [],
    exports: [],
    declarations: [
        PanoramaComponent,
        PamoramaResumoComponent,
        PanoramaTemasComponent
    ],
    providers: [],
})
export class PanoramaModule { }
