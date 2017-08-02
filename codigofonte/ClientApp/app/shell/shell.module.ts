import { NgModule, Optional, SkipSelf } from '@angular/core';
// import { BarraGov } from './barra-gov/barra-gov';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { SharedModule2 } from '../shared2/shared.module';
import { SharedModule3 } from '../shared3/shared3.module';
import { SinteseModule } from '../sintese/sintese.module';
import { Panorama2Module } from '../panorama2/panorama2.module'
import { PesquisaModule2 } from '../pesquisa/pesquisa.module';
import { AniversarioModule } from '../aniversario/aniversario.module';
import { SandboxModule } from '../sandbox/sandbox.module';
// import { RootComponent } from '../root.component';
// import { EmptyComponent } from '../empty.component';
import { VisaoHistoricaModule } from '../visao-historica/visao-historica.module';

// import { ValidParametersGuard } from '../valid-parameters.guard';
// import { EmptyLocationGuard } from '../empty-location.guard';
// import { V3RouterGuard } from '../v3-router.guard';

import { BASES, PESQUISAS } from '../global-config';

import { SubmenuComponent } from '../submenu/submenu.component';
import { PesquisaHomeComponent } from '../home/pesquisa-home.component';

// import { BasicCacheModule } from '../cache/basic-cache.module';

import { ShellComponent } from './shell.component';
import { IBGECartogramaModule } from '../infografia/ibge-cartograma/ibge-cartograma.module';

@NgModule({
    imports: [
        CoreModule,
        SharedModule,
        SharedModule2,
        SharedModule3,
        PesquisaModule2,
        SinteseModule,
        Panorama2Module,
        VisaoHistoricaModule,
        AniversarioModule,
        SandboxModule,
        Ng2PageScrollModule.forRoot(),
        // BasicCacheModule,
        IBGECartogramaModule.forRoot()
    ],
    declarations: [
        // RootComponent,
        ShellComponent,
        SubmenuComponent,
        PesquisaHomeComponent,
        // EmptyComponent,
        // BarraGov
    ],
    exports: [
        ShellComponent,
        PesquisaHomeComponent
    ],
    providers: [
        // ValidParametersGuard,
        // EmptyLocationGuard,
        // V3RouterGuard,
        PESQUISAS,
        BASES
    ]
})
export class ShellModule {
    constructor( @Optional() @SkipSelf() parentModule: ShellModule) {
        throwIfAlreadyLoaded(parentModule, 'ShellModule');
    }
}

function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
    if (parentModule) {
        throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
    }
}