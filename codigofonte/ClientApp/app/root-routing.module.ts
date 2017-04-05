import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SinteseComponent } from './sintese/sintese.component';
import { SinteseDetalhesComponent } from './sintese/sintese-detalhes/sintese-detalhes.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { PesquisaComponent2 } from './pesquisa2/pesquisa.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', redirectTo: 'panorama', pathMatch: 'full' },

  { path: 'panorama',
    component: PanoramaComponent
  },

  { path: 'pesquisa2/:pesquisa',
    component: PesquisaComponent2
  },

  {
    path: 'sintese',
    component: SinteseComponent,
    children: [
      { path: '', redirectTo: 'historico', pathMatch: 'full' },
      { path: ':indicador', component: SinteseDetalhesComponent }
    ]
  },

  { path: 'pesquisas/:pesquisa/:indicador', component: PesquisaComponent },
  { path: 'pesquisas/:pesquisa', component: PesquisaComponent },
  { path: 'pesquisas/mapa', component: PesquisaComponent },
  { path: 'pesquisas', redirectTo: 'pesquisas/23/27652' },

];

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'brasil/rj/rio-de-janeiro/panorama',
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