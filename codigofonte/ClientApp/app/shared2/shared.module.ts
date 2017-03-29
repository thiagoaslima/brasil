import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LocalidadeService2 } from './localidade/localidade.service';
import { PesquisaService2 } from './pesquisa/pesquisa.service';
import { IndicadorService2 } from './indicador/indicador.service';
import { ResultadoService2 } from './resultado/resultado.service';
import { PesquisaConfiguration } from './pesquisa/pesquisa.configuration';


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
    // put pipes here
];

const COMPONENTS = [
    // put shared components here
];

const PROVIDERS = [
    LocalidadeService2,
    PesquisaConfiguration,
    PesquisaService2, 
    IndicadorService2,
    ResultadoService2,
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
                ...PROVIDERS
            ]
        };
    }
}
