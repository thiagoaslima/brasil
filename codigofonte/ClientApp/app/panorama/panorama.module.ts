import { NgModule } from '@angular/core';

import { PanoramaComponent } from './panorama.component';
import { PanoramaResumoComponent } from './panorama-resumo/panorama-resumo.component'
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';
import { PanoramaCardComponent } from './panorama-temas/panorama-card/panorama-card.component';

import { GraficoComponent } from './panorama-temas/grafico/grafico.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../shared/ng2-charts.module';

@NgModule({
    imports: [
        SharedModule,
        ChartsModule
    ],
    exports: [],
    declarations: [
        PanoramaComponent,
        PanoramaResumoComponent,
        PanoramaTemasComponent,
        PanoramaCardComponent,
        GraficoComponent
    ],
    providers: [],
})
export class PanoramaModule { }
