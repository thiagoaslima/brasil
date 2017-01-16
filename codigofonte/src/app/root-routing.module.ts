import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SinteseComponent, pathMatch: 'full' }
    ])
  ],
})
export class RootRoutingModule { }