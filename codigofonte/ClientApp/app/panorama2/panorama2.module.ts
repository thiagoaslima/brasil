import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Panorama2Service } from './panorama.service';
import { PanoramaShellComponent } from './panorama-shell/panorama-shell.component';
import { PanoramaResumoComponent } from './panorama-resumo/panorama-resumo.component';
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';
import { SharedModule3 } from "../shared3/shared3.module";


@NgModule({
    imports: [
        CommonModule,
        SharedModule3
    ],
    exports: [],
    declarations: [
        PanoramaShellComponent,
        PanoramaResumoComponent,
        PanoramaTemasComponent
    ],
    providers: [
        Panorama2Service
    ]
})
export class Panorama2Module { }