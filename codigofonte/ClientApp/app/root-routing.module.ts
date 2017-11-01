import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { PanoramaShellComponent } from './panorama2/panorama-shell/panorama-shell.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { VisaoHistoricaComponent } from './visao-historica/visao-historica.component';
import { Page404Component } from './core/page404/page404.component';

import { PesquisaHomeComponent } from './home/pesquisa-home.component';
import { HomeComponent } from './home/home.component';
import { EstadoSinteseComponent } from './estado-sintese/estado-sintese.component';

import { SandboxComponent } from './sandbox/sandbox.component';
import { ValidParametersGuard } from './valid-parameters.guard';

import { LoginComponent } from './core/login/login.component';

import { AuthorizationGuard } from './authorization.guard';
import { V3RouterGuard } from './v3-router.guard';
import { EmptyComponent } from './empty.component';

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
          canActivate: [AuthorizationGuard],
          component: HomeComponent
        },
        {
          path: 'pesquisas',
          canActivate: [AuthorizationGuard],
          component: PesquisaHomeComponent,
        }]
      },
      {
        path: 'brasil/sintese/:uf',
        canActivate: [AuthorizationGuard],
        component: EstadoSinteseComponent
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
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'v4/brasil',
        redirectTo: 'brasil/panorama',
        pathMatch: 'full'
      },
      {
        path: 'brasil',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: 'brasil/panorama',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: 'brasil/pesquisa',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: 'brasil/historico',
        redirectTo: '/',
        pathMatch: 'full'
      },
      // {
      //   path: 'brasil',
      //   redirectTo: 'brasil/panorama',
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'brasil/panorama',
      //   component: ShellComponent,
      //   canActivate: [AuthorizationGuard],
      //   children: [
      //     { path: '', component: PanoramaShellComponent, pathMatch: 'full' },
      //   ]
      // },
      // {
      //   path: 'brasil/pesquisa',
      //   component: ShellComponent,
      //   canActivate: [AuthorizationGuard],
      //   children: [
      //     { path: '', component: PesquisaComponent, pathMatch: 'full' },
      //     { path: ':pesquisa', component: PesquisaComponent },
      //     { path: ':pesquisa/:indicador', component: PesquisaComponent }
      //   ]
      // },
      // {
      //   path: 'brasil/historico',
      //   component: ShellComponent,
      //   canActivate: [AuthorizationGuard],
      //   children: [
      //     { path: '', component: VisaoHistoricaComponent, pathMatch: 'full' },
      //   ]
      // },
      {
        path: 'brasil/:uf',
        canActivate: [ValidParametersGuard, AuthorizationGuard],
        component: ShellComponent,
        children
      },
      {
        path: 'brasil/:uf/:municipio',
        canActivate: [ValidParametersGuard, AuthorizationGuard],
        component: ShellComponent,
        children
      },
      {
        path: 'municipio/:codmun',
        canActivate: [V3RouterGuard, AuthorizationGuard],
        component: EmptyComponent
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
      },
      

    ])

  ]
})
export class RootRoutingModule { }
