import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';


const rootRoutes = [
    {
        path: '',
        redirectTo: 'brasil/rj/rio-de-janeiro/sintese/historico',
        pathMatch: 'full'
    },
    {
        path: 'brasil/sandbox',
        component: SandboxComponent
    },
    {
        path: 'brasil',
        pathMatch: 'full',
        redirectTo: 'brasil/rj/rio-de-janeiro/sintese/historico'
    },
    {
        path: 'brasil/:uf',
        pathMatch: 'full',
        redirectTo: 'brasil/rj/rio-de-janeiro/sintese/historico'
    },
    {
        path: 'brasil/:uf/:municipio',
        canActivate: [ValidParametersGuard],
        children: [
            { path: '', redirectTo: 'sintese/historico', pathMatch: 'full' },
            { path: 'sintese', redirectTo: 'sintese/historico' },
            { path: 'sintese/:indicador', component: SinteseComponent },

            { path: 'pesquisas/:pesquisa/:indicador', component: PesquisaComponent },
            { path: 'pesquisas/:pesquisa', component: PesquisaComponent },
            { path: 'pesquisas/mapa', component: PesquisaComponent },
            { path: 'pesquisas', redirectTo: 'pesquisas/23/27652' },

        ]
    }
]


export const rootRouting: ModuleWithProviders = RouterModule.forRoot(rootRoutes);