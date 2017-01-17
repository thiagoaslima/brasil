import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';

const children = [
  { path: '', component: SinteseComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild([
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
        canActivate: [],
        children
      },
      {
        path: 'brasil/:uf/:municipio',
        canActivate: [],
        children
      }
    ])
  ]
})
export class RootRoutingModule { }