import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgxPageScrollModule } from 'ngx-page-scroll';

import { InfografiaModule } from '../infografia/infografia.module';
import { PanoramaService } from './panorama.service';

import { PanoramaShellComponent } from './panorama-shell/panorama-shell.component';
import { PanoramaResumoComponent } from './panorama-resumo/panorama-resumo.component';
import { PanoramaTemasComponent } from './panorama-temas/panorama-temas.component';
import { PanoramaPainelComponent } from './panorama-painel/panorama-painel.component';
import { PanoramaCardComponent } from './panorama-card/panorama-card.component';

import { SharedModule } from '../shared';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'panorama',
        pathMatch: 'full'
    },
    {
        path: 'panorama',
        component: PanoramaShellComponent,
        pathMatch: 'full',
    },
    {
        path: ':uf',
        redirectTo: ':uf/panorama',
        pathMatch: 'full'
    },
    {
        path: ':uf/panorama',
        component: PanoramaShellComponent,
        data: {
            meta: {
                title: 'Panorama'
            }
        }
    }
];

export const routedComponents = [
    PanoramaShellComponent
];

export const components = [
        PanoramaResumoComponent,
        PanoramaTemasComponent,
        PanoramaPainelComponent,
        PanoramaCardComponent,
];

@NgModule({
    imports: [
        CommonModule,
        InfografiaModule,
        SharedModule,
        NgxPageScrollModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
    declarations: [
        ...components,
        ...routedComponents,
    ],
    providers: [
        PanoramaService
    ]
})
export class PanoramaModule { }
