import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Page404Component } from './page404.component';

const routes: Routes = [
  { path: '', component: Page404Component },
];

export const routedComponents = [Page404Component];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
    declarations: [
        ...routedComponents,
    ],
    entryComponents: [Page404Component]
})
export class Page404Module { }
