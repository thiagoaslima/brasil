import { TraducaoModule } from '../traducao/traducao.module';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WindowEventsModule } from './window-events/window-events.module';
import { TopoJson, TOPOJSON } from './topojson.v2';

import { AnalyticsService } from './analytics.service';
import { RouterParamsService } from './router-params.service';
import { CommonService } from './common.service';
import { ResultadoPipe } from './resultado.pipe';
import { CortaTextoPipe } from './corta-texto.pipe';
import { IsMobileService } from './is-mobile.service';
import { QRCodeComponent } from './qrcode/qrcode.component';
import { Breadcrumb } from './breadcrumb/breadcrumb.component';
import { MensagemSetasComponent } from './mensagem-setas/mensagem-setas.component';
import { NaoAcheiComponent } from './nao-achei/nao-achei.component';
import { QuestionarioComponent } from './questionario/questionario.component';

const MODULES = [
    // Do NOT include UniversalModule, HttpModule, or JsonpModule here
    CommonModule,
    RouterModule,
    FormsModule,
    WindowEventsModule,
    ReactiveFormsModule,
    TraducaoModule
];

const PIPES = [
    // put pipes here
    ResultadoPipe,
    CortaTextoPipe
];

const COMPONENTS = [
    // put shared components here
    QRCodeComponent,
    Breadcrumb,
    MensagemSetasComponent,
    NaoAcheiComponent,
    QuestionarioComponent
];

const PROVIDERS = [
    RouterParamsService,
    CommonService,
    IsMobileService,
    {
        provide: AnalyticsService,
        deps: [Router],
        useFactory: (router: Router) => {
            return new AnalyticsService('UA-285486-1', router);
        }
    },
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
