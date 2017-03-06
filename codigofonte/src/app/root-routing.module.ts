import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', redirectTo: 'sintese/historico', pathMatch: 'full' },
  { path: 'sintese', redirectTo: 'sintese/historico'},
  { path: 'sintese/:indicador/historico', component: SinteseComponent },
  { path: 'sintese/:indicador', component: SinteseComponent },
  
  { path: 'pesquisas/:pesquisa/:indicador', component: PesquisaComponent },
  { path: 'pesquisas/:pesquisa', component: PesquisaComponent },
  { path: 'pesquisas/mapa', component: PesquisaComponent },
  { path: 'pesquisas', redirectTo: 'pesquisas/23/27652' },

];

@NgModule({
  imports: [
    RouterModule.forChild([
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