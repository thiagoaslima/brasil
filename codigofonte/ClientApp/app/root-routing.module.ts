import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';
import { SinteseDetalhesComponent } from './sintese/sintese-detalhes/sintese-detalhes.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { PesquisaComponent2 } from './pesquisa2/pesquisa.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
    { path: '', redirectTo: 'panorama', pathMatch: 'full' },

    {
        path: 'panorama',
        component: PanoramaComponent
    },

    { path: 'pesquisa', component: PesquisaComponent2 },
    { path: 'pesquisa/:pesquisa', component: PesquisaComponent2 },
    { path: 'pesquisa/:pesquisa/:indicador', component: PesquisaComponent2 },
];

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'v4/brasil/rj/rio-de-janeiro/panorama',
                pathMatch: 'full'
            },
            {
                path: 'brasil/sandbox',
                redirectTo: 'v4/brasil/sandbox'
            },
            {
                path: 'brasil',
                redirectTo: 'v4/brasil'
            },
            {
                path: 'brasil/:uf',
                redirectTo: 'v4/brasil/:uf'
            },
            {
                path: 'brasil/:uf/:municipio',
                redirectTo: 'v4/brasil/:uf/:municipio'
            },
            {
                path: 'v4/brasil/sandbox',
                component: SandboxComponent
            },
            {
                path: 'v4/brasil',
                children
            },
            {
                path: 'v4/brasil/:uf',
                canActivate: [ValidParametersGuard],
                children
            },
            {
                path: 'v4/brasil/:uf/:municipio',
                canActivate: [ValidParametersGuard],
                children
            }
        ])
    ]
})
export class RootRoutingModule { }