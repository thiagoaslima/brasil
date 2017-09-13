import { V3RouterGuard } from './v3-router.guard';
import { EmptyComponent } from './empty.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { PanoramaShellComponent } from './panorama2/panorama-shell/panorama-shell.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { VisaoHistoricaComponent } from './visao-historica/visao-historica.component';
import { Page404Component } from './core/page404/page404.component';

import { PesquisaHomeComponent } from './home/pesquisa-home.component';
import { HomeComponent } from './home/home.component';

import { PesquisaCacheComponent, IndicadorCacheComponent } from './cache/components';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';


const children = [
  {
    path: '',
    redirectTo: 'panorama',
    pathMatch: 'full'
  },
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
        path: 'v4',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        component: ShellComponent,
        // pathMatch: 'full',
        children: [{
          path: '',
          pathMatch: 'full',
          component: HomeComponent
        },
        {
          path: 'pesquisas',
          component: PesquisaHomeComponent
        }]
      },
      {
        path: 'v4/brasil/sandbox',
        redirectTo: 'brasil/sandbox',
      },
      {
        path: 'brasil/sandbox',
        component: SandboxComponent
      },
      {
        path: 'v4/brasil',
        redirectTo: 'brasil/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil',
        redirectTo: 'brasil/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil/panorama',
        component: ShellComponent,
        children: [
          { path: '', component: PanoramaShellComponent, pathMatch: 'full' },
        ]
      },
      {
        path: 'brasil/pesquisa',
        component: ShellComponent,
        children: [
          { path: '', component: PesquisaComponent, pathMatch: 'full' },
          { path: ':pesquisa', component: PesquisaComponent },
          { path: ':pesquisa/:indicador', component: PesquisaComponent }
        ]
      },
      {
        path: 'brasil/historico',
        component: ShellComponent,
        children: [
          { path: '', component: VisaoHistoricaComponent, pathMatch: 'full' },
        ]
      },
      {
        path: 'brasil/:uf',
        canActivate: [ValidParametersGuard],
        component: ShellComponent,
        children
      },
      {
        path: 'brasil/:uf/:municipio',
        canActivate: [ValidParametersGuard],
        component: ShellComponent,
        children
      },
      {
        path: 'municipio/:codmun',
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

      /** REMOÇÃO DO V4 ANTES DAS URLS */
      {
        path: 'v4/brasil',
        redirectTo: 'brasil/panorama',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/:uf',
        redirectTo: 'brasil/:uf/panorama',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/pesquisa',
        redirectTo: 'brasil/pesquisa'
      },
      {
        path: 'v4/brasil/:uf/panorama',
        redirectTo: 'brasil/:uf/panorama',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/:uf/historico',
        redirectTo: 'brasil/:uf/historico',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/:uf/pesquisa',
        redirectTo: 'brasil/:uf/pesquisa',
      },
      {
        path: 'v4/brasil/:uf/:municipio',
        redirectTo: 'brasil/:uf/:municipio/panorama',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/:uf/:municipio/panorama',
        redirectTo: 'brasil/:uf/:municipio/panorama',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/:uf/:municipio/historico',
        redirectTo: 'brasil/:uf/:municipio/historico',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/:uf/:municipio/pesquisa',
        redirectTo: 'brasil/:uf/:municipio/pesquisa'
      },

      /** PAGE 404 */
      {
        path: '**',
        component: Page404Component
      }
    ])

  ]
})
export class RootRoutingModule { }
