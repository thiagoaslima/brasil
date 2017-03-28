import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app/app.component';
import { TestesComponent } from './testes/testes/testes.component';
import { PesquisaTesteComponent } from './testes/pesquisa/pesquisa-teste.component'
import { LocalidadeTesteComponent } from './testes/localidade/localidade-teste.component'
import { ResultadoTesteComponent } from './testes/resultado/resultado-teste.component'


const routes = [
    { path: '', redirectTo: 'testes', pathMatch: 'full' },
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
    }
]

export const rootRouting: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});