import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LocalidadeService } from './localidade/localidade.service';
import { PesquisaService } from './pesquisa/pesquisa.service';
import { IndicadorService } from './indicador/indicador.service';
import { ResultadoService } from './resultado/resultado.service';
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
    LocalidadeService,
    PesquisaConfiguration,
    PesquisaService, 
    IndicadorService,
    ResultadoService,
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
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                ...PROVIDERS
            ]
        };
    }
}
