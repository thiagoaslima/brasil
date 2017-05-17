import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanoramaShellComponent } from './panorama-shell/panorama-shell.component';
import { PanoramaResumoComponent } from './panorama-resumo/panorama-resumo.component';


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [],
    declarations: [
        PanoramaShellComponent,
        PanoramaResumoComponent
    ],
    providers: []
})
export class Panorama2Module { }