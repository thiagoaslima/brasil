import { NgModule, OpaqueToken } from '@angular/core';
import { BarraGov } from './barra-gov/barra-gov';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { CoreModule } from './core/core.module';

import { SharedModule } from './shared/shared.module';
import { SharedModule2 } from './shared2/shared.module';

import { SinteseModule } from './sintese/sintese.module';
import { PanoramaModule } from './panorama/panorama.module'
import { PesquisaModule2 } from './pesquisa2/pesquisa.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';
import { EmptyComponent } from './empty.component';
import { VisaoHistoricaModule } from './visao-historica/visao-historica.module';

import { ValidParametersGuard } from './valid-parameters.guard';
import { EmptyLocationGuard } from './empty-location.guard';
import { V3RouterGuard } from './v3-router.guard';

import { BASES, PESQUISAS } from './global-config';

import { SubmenuComponent } from './submenu/submenu.component';

import { BasicCacheModule } from './cache/basic-cache.module';

@NgModule({
    imports: [
        CoreModule,
        SharedModule.forRoot(),
        SharedModule2.forRoot(),
        PesquisaModule2,
        SinteseModule,
        PanoramaModule,
        VisaoHistoricaModule,
        SandboxModule,
        Ng2PageScrollModule.forRoot(),
        BasicCacheModule
    ],
    declarations: [
        RootComponent,
        SubmenuComponent,
        EmptyComponent,
        BarraGov
    ],
    exports: [
        RootComponent
    ],
    providers: [
        ValidParametersGuard,
        EmptyLocationGuard,
        V3RouterGuard,
        PESQUISAS,
        BASES
    ]
})
export class RootModule { }