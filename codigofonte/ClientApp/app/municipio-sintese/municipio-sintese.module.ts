import { PanoramaService } from '../panorama/panorama.service';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MunicipioSinteseComponent } from './municipio-sintese.component';
import { MunicipioSinteseService } from './municipio-sintese.service';

import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: ':uf/:municipio',
        component: MunicipioSinteseComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    exports: [],
    declarations: [MunicipioSinteseComponent],
    providers:[
        PanoramaService,
        MunicipioSinteseService
    ],
})
export class MunicipioSinteseModule {}