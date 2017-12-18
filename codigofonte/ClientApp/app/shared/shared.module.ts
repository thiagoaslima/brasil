import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicCacheModule } from './cache/basic-cache.module';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';

import { TraducaoModule } from './traducao';
import { WindowEventsModule } from './window-events/window-events.module';

import {
    ResultadoPipe,
    Breadcrumb,
    MensagemSetasComponent,
    NaoAcheiComponent,
    QRCodeComponent,
    QuestionarioComponent,
    CortaTextoPipe,

    BibliotecaService,
    ConjunturaisService,
    IndicadorService3,
    LocalidadeService3,
    PesquisaService3,
    PesquisaConfiguration,
    RankingService3,
    ResultadoService3,
    AnalyticsService,
    AppState,
    RouterParamsService,
    IsMobileService,
    ConfigService,
    CommonService,
    TopoJson,
    TOPOJSON,
} from './';

const declarations = [
    ResultadoPipe,
    Breadcrumb,
    MensagemSetasComponent,
    NaoAcheiComponent,
    QRCodeComponent,
    QuestionarioComponent,
    CortaTextoPipe,
]

const providers = [
    ConfigService,
    BibliotecaService,
    LocalidadeService3,
    ConjunturaisService,
    IndicadorService3,
    PesquisaService3,
    PesquisaConfiguration,
    RankingService3,
    ResultadoService3,
    {
        provide: AnalyticsService,
        deps: [Router, PLATFORM_ID],
        useFactory: (router: Router, platformId: string) => {
            return new AnalyticsService('UA-285486-1', router, platformId)
        }
    },
    AppState,
    RouterParamsService,
    IsMobileService,
    CommonService,
    {
        provide: TOPOJSON,
        useValue: TopoJson,
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TraducaoModule.forRoot(),
        BasicCacheModule,
        WindowEventsModule,
    ],
    declarations: [
        ...declarations,
    ],
    exports: [
        ...declarations,
        CommonModule,
        FormsModule,
        TraducaoModule,
        WindowEventsModule,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                ...providers
            ]
        };
    }
}