import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from './ng2-charts.module';
import { WindowEventsModule } from './window-events/window-events.module';
import { TopoJson, TOPOJSON } from './topojson.v2';

import { RouterParamsService } from './router-params.service';
import { LocalidadeService } from './localidade/localidade.service';
import { PesquisaService } from './pesquisa/pesquisa.service';
import { PesquisaServiceWithCache } from './pesquisa/pesquisa-with-cache.service';
import { BuscaService } from '../core/busca/busca.service';
import { CommonService } from './common.service';

import {ResultadoPipe} from '../utils/resultado.pipe';

const MODULES = [
    // Do NOT include UniversalModule, HttpModule, or JsonpModule here
    CommonModule,
    RouterModule,
    FormsModule,
    WindowEventsModule,
    ReactiveFormsModule
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
    LocalidadeService,
    CommonService,
    BuscaService,
    { provide: PesquisaService, useClass: PesquisaServiceWithCache },
    { provide: TOPOJSON, useValue: TopoJson }
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
