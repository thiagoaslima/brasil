import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppState } from './app-state';
import { LocalidadeService2 } from './localidade/localidade.service';
import { PesquisaService2 } from './pesquisa/pesquisa.service';
import { IndicadorService2 } from './indicador/indicador.service';
import { ResultadoService2 } from './resultado/resultado.service';
import { PesquisaConfiguration } from './pesquisa/pesquisa.configuration';

import { ResultadoPipe } from './resultado.pipe';


export function getLRU() {
    return new Map();
}

const MODULES = [
    // Do NOT include UniversalModule, HttpModule, or JsonpModule here
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
];

const PIPES = [
    ResultadoPipe
];

const COMPONENTS = [
    // put shared components here
];

const PROVIDERS = [
    AppState,
    LocalidadeService2,
    PesquisaService2,
    IndicadorService2,
    ResultadoService2,
    PesquisaConfiguration,
    { provide: 'LRU', useFactory: getLRU, deps: [] }
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
export class SharedModule2 {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule2,
            providers: [
                ...PROVIDERS,
                {
                    provide: APP_INITIALIZER,
                    useFactory: loadConfig,
                    deps: [
                        LocalidadeService2,
                        PesquisaService2,
                        IndicadorService2,
                        ResultadoService2,
                        PesquisaConfiguration
                    ],
                    multi: true
                }
            ]
        };
    }
}
export const loadConfig = (...args) => () => {};