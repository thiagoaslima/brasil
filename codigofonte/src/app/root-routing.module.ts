import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', component: SinteseComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'brasil/sandbox',
        component: SandboxComponent
      },
      { 
        path: '',
        redirectTo: 'brasil',
        pathMatch: 'full'
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