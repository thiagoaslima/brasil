import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './core.guard';

import { SharedModule } from '../shared/shared.module';
import { SharedModule2 } from '../shared2/shared.module';
import { SeletorLocalidadeComponent } from './seletor-localidade/seletor-localidade.component';
import { SeletorLocalidadeService } from './seletor-localidade/seletor-localidade.service';
import { BuscaComponent } from './busca/busca.component';
import { BuscaService } from './busca/busca.service';
import { TituloBrowserComponent } from './titulo-browser/titulo-browser.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { MetatagBrowserComponent } from './metatag-browser/metatag-browser.component';
import { Page404Component } from './page404/page404.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedModule2
  ],
  declarations: [
    SeletorLocalidadeComponent,
    BuscaComponent,
    TituloBrowserComponent,
    GeolocationComponent,
    MetatagBrowserComponent,
    Page404Component
  ],
  exports: [
    SeletorLocalidadeComponent,
    BuscaComponent,
    TituloBrowserComponent,
    GeolocationComponent,
    MetatagBrowserComponent
  ],
  providers: [
    BuscaService,
    SeletorLocalidadeService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
