import { V3RouterGuard } from './v3-router.guard';
import { EmptyComponent } from './empty.component';
import { EmptyLocationGuard } from './empty-location.guard';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PanoramaComponent } from './panorama/panorama.component';
import { PesquisaComponent2 } from './pesquisa2/pesquisa.component';
import { VisaoHistoricaComponent } from './visao-historica/visao-historica.component';


import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', redirectTo: 'panorama', pathMatch: 'full' },

  { path: 'panorama',
    component: PanoramaComponent
  },

  { path: 'historico',
    component: VisaoHistoricaComponent
  },

  { path: 'pesquisa', component: PesquisaComponent2},
  { path: 'pesquisa/:pesquisa', component: PesquisaComponent2},
  { path: 'pesquisa/:pesquisa/:indicador', component: PesquisaComponent2},
];

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        canActivate: [EmptyLocationGuard],
        component: EmptyComponent,
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/sandbox',
        component: SandboxComponent
      },
      {
        path: 'brasil/sandbox',
        redirectTo: 'v4/brasil/sandbox',
      },
      {
        path: 'v4/municipio/:codmun',
        canActivate: [V3RouterGuard],
        component: EmptyComponent
      },
      {
        path: 'v4/brasil',
        redirectTo: 'v4/brasil/rj/rio-de-janeiro/panorama',
        pathMatch: 'full'
        // children
      },
      {
        path: 'v4/brasil/:uf',
        redirectTo: 'v4/brasil/rj/rio-de-janeiro/panorama',
        pathMatch: 'full'
        // canActivate: [ValidParametersGuard],
        // children
      },
      {
        path: 'v4/brasil/:uf/:municipio',
        canActivate: [ValidParametersGuard],
        children
      },
      {
        path: 'brasil/:uf/:municipio',
        redirectTo: 'v4/brasil/:uf/:municipio',
      },
      {
        path: '**',
        redirectTo: 'v4/brasil/rj/rio-de-janeiro/panorama'
      }
    ])
  ]
})
export class RootRoutingModule { }