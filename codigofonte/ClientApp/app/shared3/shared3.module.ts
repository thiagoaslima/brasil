import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';

import { CacheFactory } from '../cache/cacheFactory.service';
import { IndicadorService3, LocalidadeService3, PesquisaService3, ResultadoService3 } from './services'

const MODULES = [
    // Do NOT include UniversalModule, HttpModule, or JsonpModule here
    CommonModule,
    RouterModule
];

const PIPES = [
    
];

const COMPONENTS = [
    
];

const PROVIDERS = [
    PesquisaService3,
    LocalidadeService3,
    {
        provide: IndicadorService3,
        deps: [Http, PesquisaService3],
        useFactory: (http, pesquisaService) => new IndicadorService3(http, pesquisaService)
    },
    {
        provide: ResultadoService3,
        deps: [Http, IndicadorService3, LocalidadeService3],
        useFactory: (http, indicadorService, localidadeService) => new ResultadoService3(http, indicadorService, localidadeService)
    }
]

@NgModule({
     imports: [
        ...MODULES
    ],
    declarations: [
        ...PIPES,
        ...COMPONENTS
    ],
    exports: [
        ...MODULES,
        ...PIPES,
        ...COMPONENTS
    ]
})
export class SharedModule3 {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule3,
            providers: [
                ...PROVIDERS
            ]
        };
    }
}