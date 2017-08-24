import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfografiaModule } from '../infografia/infografia.module';
import { Panorama2Service } from './panorama.service';
import { PanoramaBrasilComponent } from './panorama-brasil/panorama-brasil.component';
import { PanoramaShellComponent } from './panorama-shell/panorama-shell.component';
import { PanoramaResumoComponent } from './panorama-resumo/panorama-resumo.component';
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';
import { PanoramaPainelComponent } from './panorama-painel/panorama-painel.component';
import { PanoramaCardComponent } from './panorama-card/panorama-card.component';
import { SharedModule3 } from '../shared3/shared3.module';


@NgModule({
    imports: [
        CommonModule,
        InfografiaModule,
        SharedModule,
        SharedModule3
    ],
    exports: [],
    declarations: [
        PanoramaBrasilComponent,
        PanoramaShellComponent,
        PanoramaResumoComponent,
        PanoramaTemasComponent,
        PanoramaPainelComponent,
        PanoramaCardComponent
    ],
    providers: [
        Panorama2Service
    ]
})
export class Panorama2Module { }