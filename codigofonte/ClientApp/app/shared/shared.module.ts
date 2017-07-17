import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WindowEventsModule } from './window-events/window-events.module';
import { TopoJson, TOPOJSON } from './topojson.v2';

import { RouterParamsService } from './router-params.service';
import { CommonService } from './common.service';
import { ResultadoPipe } from './resultado.pipe';
import { IsMobileService } from './is-mobile.service';
import { QRCodeComponent } from './qrcode/qrcode.component';
import { Breadcrumb } from './breadcrumb/breadcrumb.component';
import { MensagemSetasComponent } from './mensagem-setas/mensagem-setas.component';
import { NaoAcheiComponent } from './nao-achei/nao-achei.component';

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
    QRCodeComponent,
    Breadcrumb,
    MensagemSetasComponent,
    NaoAcheiComponent
];

const PROVIDERS = [
    RouterParamsService,
    CommonService,
    IsMobileService,
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
