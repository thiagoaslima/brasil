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

import { VisaoHistoricaComponent } from './visao-historica/visao-historica.component';
import { VisaoHistoricaModule } from './visao-historica/visao-historica.module';

import { PesquisaModule } from './pesquisa/pesquisa.module';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

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
        path: 'historico',
        component: VisaoHistoricaComponent,
        data: {
                meta: {
                    title: 'Histórico',
                    
                }
        },
    },
    { path: 'pesquisa/:pesquisa', component: PesquisaComponent },
    { path: 'pesquisa/:pesquisa/:indicador', component: PesquisaComponent },
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
    },
    {
        path: ':uf/historico',
        component: VisaoHistoricaComponent,
        data: {
                meta: {
                    title: 'Histórico',
                    
                }
        },
    },
    { path: ':uf/pesquisa/:pesquisa', component: PesquisaComponent },
    { path: ':uf/pesquisa/:pesquisa/:indicador', component: PesquisaComponent },
    {
        path: ':uf/:municipio',
        redirectTo: ':uf/:municipio/panorama',
        pathMatch: 'full'
    },
    {
        path: ':uf/:municipio/panorama',
        component: PanoramaShellComponent,
        data: {
            meta: {
                title: 'Panorama'
            }
        }
    },
    {
        path: ':uf/:municipio/historico',
        component: VisaoHistoricaComponent,
        data: {
                meta: {
                    title: 'Histórico',
                    
                }
        },
    },
    { path: ':uf/:municipio/pesquisa/:pesquisa', component: PesquisaComponent },
    { path: ':uf/:municipio/pesquisa/:pesquisa/:indicador', component: PesquisaComponent },
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
        VisaoHistoricaModule,
        PesquisaModule,
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
