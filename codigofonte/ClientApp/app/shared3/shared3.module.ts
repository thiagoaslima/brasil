import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IndicadorService3, PesquisaService3, ResultadoService3 } from './services'

const MODULES = [
    // Do NOT include UniversalModule, HttpModule, or JsonpModule here
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
];

const PIPES = [
    
];

const COMPONENTS = [
    
];

const PROVIDERS = [
    PesquisaService3,
    // IndicadorService3,
    // ResultadoService3
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