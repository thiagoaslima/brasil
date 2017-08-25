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
import { PanoramaBrasilComponent } from './panorama2/panorama-brasil/panorama-brasil.component';

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
        path: '',
        redirectTo: 'v4',
        pathMatch: 'full'
      },
      {
        path: 'v4',
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
        path: 'brasil/sandbox',
        redirectTo: 'v4/brasil/sandbox',
      },
      {
        path: 'v4/brasil/sandbox',
        component: SandboxComponent
      },
      {
        path: 'v4/brasil',
        redirectTo: 'v4/brasil/panorama',
        pathMatch: 'full'
      },
      {
        path: 'v4/brasil/panorama',
        component: ShellComponent,
        children: [
          { path: '', component: PanoramaBrasilComponent, pathMatch: 'full' },
        ]
      },
      {
        path: 'v4/brasil/pesquisa',
        component: ShellComponent,
        children: [
          { path: '', component: PesquisaComponent, pathMatch: 'full' },
          { path: ':pesquisa', component: PesquisaComponent },
          { path: ':pesquisa/:indicador', component: PesquisaComponent }
        ]
      },
      {
        path: 'v4/brasil/historico',
        component: ShellComponent,
        children: [
          { path: '', component: VisaoHistoricaComponent, pathMatch: 'full' },
        ]
      },
      {
        path: 'v4/brasil/:uf',
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

      /** ADIÇÃO DO V4 ANTES DAS URLS */
      {
        path: 'brasil',
        redirectTo: 'v4/brasil/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil/:uf',
        redirectTo: 'v4/brasil/:uf/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil/pesquisa',
        redirectTo: 'v4/brasil/pesquisa'
      },
      {
        path: 'brasil/:uf/panorama',
        redirectTo: 'v4/brasil/:uf/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil/:uf/historico',
        redirectTo: 'v4/brasil/:uf/historico',
        pathMatch: 'full'
      },
      {
        path: 'brasil/:uf/pesquisa',
        redirectTo: 'v4/brasil/:uf/pesquisa',
      },
      {
        path: 'brasil/:uf/:municipio',
        redirectTo: 'v4/brasil/:uf/:municipio/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil/:uf/:municipio/panorama',
        redirectTo: 'v4/brasil/:uf/:municipio/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil/:uf/:municipio/historico',
        redirectTo: 'v4/brasil/:uf/:municipio/historico',
        pathMatch: 'full'
      },
      {
        path: 'brasil/:uf/:municipio/pesquisa',
        redirectTo: 'v4/brasil/:uf/:municipio/pesquisa'
      },

      /** PAGE 404 */
      {
        path: '**',
        component: Page404Component
      }
    ], { enableTracing: true })
  ]
})
export class RootRoutingModule { }
