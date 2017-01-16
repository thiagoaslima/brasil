import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LazyExampleComponent } from './lazy-example.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: LazyExampleComponent }
    ])
  ],
})
export class LazyExampleRoutingModule { }