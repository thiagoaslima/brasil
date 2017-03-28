import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PesquisaModule } from './pesquisas/pesquisa.module';

import { TopoJson, TOPOJSON } from './topojson.v2';
import { RouterParamsService } from './router-params.service';
import { ResultadoPipe } from './resultado.pipe';

export function getLRU() {
  return new Map();
}

const MODULES = [
    // Do NOT include UniversalModule, HttpModule, or JsonpModule here
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PesquisaModule
];

const PIPES = [
    // put pipes here
    ResultadoPipe
];

const COMPONENTS = [
    // put shared components here
];

const PROVIDERS = [
    RouterParamsService,
    { provide: TOPOJSON, useValue: TopoJson },
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
