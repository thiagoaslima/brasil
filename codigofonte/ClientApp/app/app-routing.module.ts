import { ShellComponent } from './core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const appRoutes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: '',
                loadChildren: './home/home.module#HomeModule',
            },
            {
                path: 'not-found',
                loadChildren: './page404/page404.module#Page404Module',
        
            },
            {
                path: '**',
                redirectTo: 'not-found',
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