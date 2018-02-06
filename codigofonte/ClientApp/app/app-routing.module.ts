import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from './authorization.guard';
import { ShellComponent } from './core';
import { LoginComponent } from './core/login';


const appRoutes: Routes = [
    {
        path: 'brasil/sintese',
        loadChildren: './estado-sintese/estado-sintese.module#EstadoSinteseModule',
        canActivate: [AuthorizationGuard]
    },
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: '',
                loadChildren: './home/home.module#HomeModule',
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'brasil',
                loadChildren: './panorama/panorama.module#PanoramaModule',
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'not-found',
                loadChildren: './page404/page404.module#Page404Module',
                canActivate: [AuthorizationGuard]
        
            },
            {
                path: '**',
                redirectTo: 'not-found',
                canActivate: [AuthorizationGuard]
            },
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: true,
                // preloadingStrategy: PreloadAllModules
            },
        ),
    ],
    declarations: [
        
    ]
    // exports: [
    //     RouterModule
    // ]
})
export class AppRoutingModule {}