import { V3RouterGuard } from './v3-router.guard';
import { EmptyComponent } from './empty.component';
import { EmptyLocationGuard } from './empty-location.guard';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { PanoramaShellComponent } from './panorama2/panorama-shell/panorama-shell.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { VisaoHistoricaComponent } from './visao-historica/visao-historica.component';
import { Page404Component } from './core/page404/page404.component';

import { PesquisaHomeComponent } from './home/pesquisa-home.component';

import { PesquisaCacheComponent, IndicadorCacheComponent } from './cache/components';


import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

const children = [
  { path: '', redirectTo: 'panorama', pathMatch: 'full' },

  // {
  //   path: 'panorama',
  //   component: PanoramaComponent
  // },

   {
    path: 'panorama',
    component: PanoramaShellComponent
  },

  {
    path: 'historico',
    component: VisaoHistoricaComponent
  },

  { path: 'pesquisa', component: PesquisaComponent },
  { path: 'pesquisa/:pesquisa', component: PesquisaComponent },
  { path: 'pesquisa/:pesquisa/:indicador', component: PesquisaComponent }

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
        path: 'v4',
        component: EmptyComponent,
        pathMatch: 'full'
      },
      {
        path: 'v4/pesquisas',
        component: PesquisaHomeComponent
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
        path: 'v4/brasil',
        redirectTo: 'v4/brasil/rj/rio-de-janeiro/panorama',
        pathMatch: 'full'
        // children
      },
      {
        path: 'brasil/:uf',
        redirectTo: 'v4/brasil/:uf',
      },
      {
        path: 'v4/brasil/:uf',
        // redirectTo: 'v4/brasil/rj/rio-de-janeiro/panorama',
        // pathMatch: 'full'
        canActivate: [ValidParametersGuard],
        component: ShellComponent,
        children
      },
      {
        path: 'v4/brasil/:uf/:municipio',
        canActivate: [ValidParametersGuard],
        component: ShellComponent,
        children
      },
      {
        path: 'brasil/:uf/:municipio',
        redirectTo: 'v4/brasil/:uf/:municipio',
      },
      {
        path: 'v4/municipio/:codmun',
        canActivate: [V3RouterGuard],
        component: EmptyComponent
      },
      {
        path: 'cache',
        component: ShellComponent,
        children: [
          { path: '', redirectTo: 'pesquisas', pathMatch: 'full' },
          { path: 'pesquisas', component: PesquisaCacheComponent },
          { path: 'indicadores', component: IndicadorCacheComponent }
        ]
      },

      {
        path: '**',
        component: Page404Component
      }
    ])
  ]
})
export class RootRoutingModule { }
