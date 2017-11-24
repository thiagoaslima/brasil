import { NgModule } from '@angular/core';
import { BarraGov } from './barra-gov/barra-gov';
// import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { MetaModule } from './ng2-meta';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SharedModule2 } from './shared2/shared.module';
import { SharedModule3 } from './shared3/shared3.module';
// import { SinteseModule } from './sintese/sintese.module';
// import { Panorama2Module } from './panorama2/panorama2.module'
// import { PesquisaModule2 } from './pesquisa/pesquisa.module';
// import { AniversarioModule } from './aniversario/aniversario.module';
// import { SandboxModule } from './sandbox/sandbox.module';
import { RootComponent } from './root.component';
import { EmptyComponent } from './empty.component';
// import { VisaoHistoricaModule } from './visao-historica/visao-historica.module';

import { ValidParametersGuard } from './valid-parameters.guard';
import { EmptyLocationGuard } from './empty-location.guard';
import { V3RouterGuard } from './v3-router.guard';

// import { BASES, PESQUISAS } from './global-config';

// import { SubmenuComponent } from './submenu/submenu.component';

import { ShellModule } from './shell/shell.module'
import { BasicCacheModule } from './cache/basic-cache.module';
import { AuthorizationGuard } from './authorization.guard';
import { LoginService } from './core/login/login.service';
import { ConfigService } from './config/config.service';


// import { IBGECartogramaModule } from './infografia/ibge-cartograma/ibge-cartograma.module';

@NgModule({
    imports: [
        
        CoreModule,
        MetaModule.forRoot(),
        SharedModule.forRoot(),
        SharedModule2.forRoot(),
        SharedModule3.forRoot(),
        ShellModule,
        // PesquisaModule2,
        // SinteseModule,
        // Panorama2Module,
        // VisaoHistoricaModule,
        // AniversarioModule,
        // SandboxModule,
        // Ng2PageScrollModule.forRoot(),
        BasicCacheModule,
        // IBGECartogramaModule.forRoot()
    ],
    declarations: [
        RootComponent,
        // SubmenuComponent,
        EmptyComponent,
        BarraGov
    ],
    exports: [
        CoreModule,
        SharedModule,
        SharedModule2,
        SharedModule3,
        BasicCacheModule,
        RootComponent
    ],
    providers: [
        LoginService,
        ValidParametersGuard,
        EmptyLocationGuard,
        V3RouterGuard,
        AuthorizationGuard,
        ConfigService
        // PESQUISAS,
        // BASES
    ]
})
export class RootModule { }
