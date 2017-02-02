import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';
import { GraficoComponent } from './sintese/grafico/grafico.component';
import { MapaComponent } from './sintese/mapa/mapa.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', component: SinteseComponent, pathMatch: 'full' },
  { path: 'sintese', component: SinteseComponent, pathMatch: 'full' },
  { path: 'sintese/:indicador', component: SinteseComponent, pathMatch: 'full'},
  { path: 'sintese/:indicador/mapa', component: SinteseComponent, pathMatch: 'full' },
  { path: 'pesquisas', redirectTo: 'pesquisas/23', pathMatch: 'full' },
  { path: 'pesquisas/:pesquisa', component: PesquisaComponent },
  { path: 'pesquisas/:pesquisa/:indicador', component: PesquisaComponent }
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