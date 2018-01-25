import { PanoramaService } from '../panorama/panorama.service';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EstadoSinteseComponent } from './estado-sintese.component';
import { EstadoSinteseService } from './estado-sintese.service';

import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: ':uf',
        component: EstadoSinteseComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    exports: [],
    declarations: [EstadoSinteseComponent],
    providers:[
        PanoramaService,
        EstadoSinteseService
    ],
})
export class EstadoSinteseModule {}