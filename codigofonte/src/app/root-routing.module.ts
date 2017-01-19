import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', component: SinteseComponent, pathMatch: 'full' },
  { path: 'sintese', component: SinteseComponent, pathMatch: 'full' },
  { path: 'sintese/:indicador', component: SinteseComponent, pathMatch: 'full' },
  { path: 'sintese/:indicador/mapa', component: SinteseComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild([
      { 
        path: '',
        redirectTo: 'brasil/rj/rio-de-janeiro',
        pathMatch: 'full'
      },
      {
        path: 'brasil/sandbox',
        component: SandboxComponent
      },
      {
        path: 'brasil',
        // children
        redirectTo: 'brasil/rj/rio-de-janeiro',
        pathMatch: 'full'
      },
      {
        path: 'brasil/:uf',
        redirectTo: 'brasil/rj/rio-de-janeiro',
        pathMatch: 'full'
        // canActivate: [ValidParametersGuard],
        // children
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