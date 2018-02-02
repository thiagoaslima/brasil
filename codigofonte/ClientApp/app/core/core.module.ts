import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import {
    AniversarioModule,

    BarraGov,
    TituloBrowserComponent,
    MetatagBrowserComponent,
    ModalErroComponent,
    ShellComponent,
    SeletorLocalidadeComponent,
    BuscaComponent,
    GeolocationComponent,
    GeolocationDirective,
    SubmenuComponent,
    
    BuscaService,
    BuscaCompletaService,
    ModalErrorService,
    SeletorLocalidadeService,
} from ".";

const declarations = [
    BarraGov,
    TituloBrowserComponent,
    MetatagBrowserComponent,
    ModalErroComponent,
    ShellComponent,
    SeletorLocalidadeComponent,
    BuscaComponent,
    GeolocationComponent,
    GeolocationDirective,
    SubmenuComponent,
];

const providers = [
    ModalErrorService,
    SeletorLocalidadeService,
    BuscaService,
    BuscaCompletaService,
]

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        SharedModule,
        RouterModule,
        NgxPageScrollModule,
        AniversarioModule,
    ],
    declarations: [
        ...declarations,
    ],
    providers: [
        ...providers,
    ],
    exports: [
        ...declarations,
    ],
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}