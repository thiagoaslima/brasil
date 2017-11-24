import { SharedModule } from '../shared';
import { PesquisaHomeComponent } from './pesquisa-home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pesquisas', component: PesquisaHomeComponent}
];

export const routedComponents = [
    HomeComponent,
    PesquisaHomeComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
    declarations: [
        ...routedComponents,
    ],
    entryComponents: [ HomeComponent ]
})
export class HomeModule { }
