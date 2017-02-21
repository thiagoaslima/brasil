import { NgModule } from '@angular/core';

import { PesquisaService } from './pesquisa.service.2';
import { Indicador, Pesquisa } from './pesquisa.interface.2'

const MODULES = [

];

const PIPES = [
    // put pipes here
];

const COMPONENTS = [
    // put shared components here
];

const PROVIDERS = [
    PesquisaService
];

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
    ],
    providers: [
        PROVIDERS
    ]
})
export class PesquisaModule { }
