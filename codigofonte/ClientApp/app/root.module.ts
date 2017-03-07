import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';

import { SharedModule } from './shared/shared.module';
import { SinteseModule } from './sintese/sintese.module';
import { PesquisaModule } from './pesquisa/pesquisa.module';
import { SandboxModule } from './sandbox/sandbox.module';

import { LocalidadeService } from './shared/localidade/localidade.service';
import { PesquisaService } from './shared/pesquisa/pesquisa.service';
import { PesquisaServiceWithCache } from './shared/pesquisa/pesquisa-with-cache.service';
import { WindowEventsService } from './shared/window-events/window-events.service';
import { CommonService } from './shared/common.service';
import { CacheService } from './shared/cache.service';
import { SystemCacheService } from './shared/system-cache.service';
import { RouterParamsService } from './shared/router-params.service';
import { BuscaService } from './core/busca/busca.service';
import { SinteseService } from './sintese/sintese.service';

import { RootComponent } from './root.component';

@NgModule({
    imports: [
        CoreModule,
        SharedModule.forRoot(),
        SinteseModule,
        PesquisaModule,
        SandboxModule
    ],
    declarations: [
        RootComponent
    ],
    exports: [
        RootComponent
    ]
})
export class RootModule {}