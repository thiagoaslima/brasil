import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WindowEventsModule } from './window-events/window-events.module';
import { TopoJson, TOPOJSON } from './topojson.v2';

// import { AppState } from './app-state';
import { RouterParamsService } from './router-params.service';
import { CacheService } from './cache.service';
import { SystemCacheService } from './system-cache.service';
import { CommonService } from './common.service';
import { ResultadoPipe } from './resultado.pipe';
import { IsMobileService } from './is-mobile.service';
import { QRCodeComponent } from './qrcode/qrcode.component';

export function getLRU() {
  return new Map();
}

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
    QRCodeComponent
];

const PROVIDERS = [
    // AppState,
    SystemCacheService,
    CacheService,
    RouterParamsService,
    CommonService,
    IsMobileService,
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
