import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';
import { SinteseDetalhesComponent } from './sintese/sintese-detalhes/sintese-detalhes.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', redirectTo: 'sintese/29171', pathMatch: 'full' },
  { path: 'sintese', redirectTo: 'sintese/29171' },
  {
    path: 'sintese',
    component: SinteseComponent,
    children: [
      { path: '', redirectTo: '29171', pathMatch: 'full' },
      { path: ':indicador', component: SinteseDetalhesComponent }
    ]
  },

  { path: 'pesquisas', redirectTo: 'pesquisas/23' },
  { path: 'pesquisas/mapa', component: PesquisaComponent },
  { path: 'pesquisas/:pesquisa', component: PesquisaComponent },
  { path: 'pesquisas/:pesquisa/:indicador', component: PesquisaComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'brasil/rj/rio-de-janeiro/sintese/29171',
        pathMatch: 'full'
      },
      {
        path: 'brasil/sandbox',
        component: SandboxComponent
      },
      {
        path: 'brasil',
        children
      },
      {
        path: 'brasil/:uf',
        canActivate: [ValidParametersGuard],
        children
      },
      {
        path: 'brasil/:uf/:municipio',
        canActivate: [ValidParametersGuard],
        children
      }
    ])
  ]
})
export class RootRoutingModule { }