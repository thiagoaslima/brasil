import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from './authorization.guard';
import { EmptyComponent } from './empty.component';
import { ShellComponent } from './core';
import { LoginComponent } from './core/login';
import { V3RouterGuard } from './v3-router.guard';


const appRoutes: Routes = [
    {
        path: 'brasil/sintese',
        loadChildren: './estado-sintese/estado-sintese.module#EstadoSinteseModule',
        canActivate: [AuthorizationGuard]
    },



    {
        path: 'brasil/sintese',
        loadChildren: './municipio-sintese/municipio-sintese.module#MunicipioSinteseModule',
        canActivate: [AuthorizationGuard]
    },




    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        component: ShellComponent,
        children: [{
                path: '',
                loadChildren: './home/home.module#HomeModule',
                canActivateChild: [AuthorizationGuard]
            },
            {
                path: 'brasil',
                loadChildren: './panorama/panorama.module#PanoramaModule',
                canActivateChild: [AuthorizationGuard]
            }
        ]
    },
    {
        path: 'not-found',
        loadChildren: './page404/page404.module#Page404Module',
        canActivateChild: [AuthorizationGuard]

    },
    {
        path: 'municipio/:codmun',
        canActivate: [V3RouterGuard],
        component: EmptyComponent
    },

    /** REMOÇÃO DO v4 ANTES DAS URLS */
    {
        path: 'v4',
        redirectTo: '',
        pathMatch: 'full'
    },
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
    {
        path: '**',
        redirectTo: 'not-found'
    },
]

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes, {
                // enableTracing: true,
                // preloadingStrategy: PreloadAllModules
            },
        ),
    ],
    providers: [
        AuthorizationGuard,
        V3RouterGuard
    ],
    declarations: [

    ]
    // exports: [
    //     RouterModule
    // ]
})
export class AppRoutingModule {}