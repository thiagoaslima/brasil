import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

import { PanoramaComponent } from './panorama/panorama.component';

import { TestesComponent } from './testes/testes/testes.component';
import { PesquisaTesteComponent } from './testes/pesquisa/pesquisa-teste.component';
import { LocalidadeTesteComponent } from './testes/localidade/localidade-teste.component';
import { ResultadoTesteComponent } from './testes/resultado/resultado-teste.component';

const rootRoutes = [
    {
        path: '',
        redirectTo: 'brasil/rj/rio-de-janeiro/panorama',
        pathMatch: 'full'
    },
    {
        path: 'brasil/sandbox',
        component: SandboxComponent
    },
    {
        path: 'brasil',
        pathMatch: 'full',
        redirectTo: 'brasil/rj/rio-de-janeiro/panorama'
    },
    {
        path: 'brasil/:uf',
        pathMatch: 'full',
        redirectTo: 'brasil/rj/rio-de-janeiro/panorama'
    },
    {
        path: 'brasil/:uf/:municipio',
        canActivate: [ValidParametersGuard],
        children: [
            { path: '', redirectTo: 'panorama', pathMatch: 'full' },
            { path: 'sintese', redirectTo: 'panorama' },
            { path: 'sintese/:indicador', component: SinteseComponent },

            { path: 'pesquisas/:pesquisa/:indicador', component: PesquisaComponent },
            { path: 'pesquisas/:pesquisa', component: PesquisaComponent },
            { path: 'pesquisas/mapa', component: PesquisaComponent },
            { path: 'pesquisas', redirectTo: 'pesquisas/23/27652' },

            { path: 'panorama', component: PanoramaComponent }
        ]
    },


    /* REMOVE ON PRODUCTION */
    {
        path: 'testes',
        component: TestesComponent,
        children: [
            { path: '', redirectTo: 'pesquisa/13', pathMatch: 'full' },
            { path: 'pesquisa', redirectTo: 'pesquisa/13', pathMatch: 'full' },
            { path: 'pesquisa/:pesquisa', component: PesquisaTesteComponent },
            { path: 'localidade', component: LocalidadeTesteComponent },
            { path: 'resultado', component: ResultadoTesteComponent },
        ]
    },

    {
        path: '**',
        redirectTo: 'brasil/rj/rio-de-janeiro/panorama'
    },
]

export const rootRouting: ModuleWithProviders = RouterModule.forRoot(rootRoutes);