import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './core.guard';

import { SharedModule } from '../shared/shared.module';
import { SeletorLocalidadeComponent } from './seletor-localidade/seletor-localidade.component';
import { BuscaComponent } from './busca/busca.component';
import { BuscaService } from './busca/busca.service';
import { TituloBrowserComponent } from './titulo-browser/titulo-browser.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { MetatagBrowserComponent } from './metatag-browser/metatag-browser.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    SeletorLocalidadeComponent,
    BuscaComponent,
    TituloBrowserComponent,
    GeolocationComponent,
    MetatagBrowserComponent
  ],
  exports: [
    SeletorLocalidadeComponent,
    BuscaComponent,
    TituloBrowserComponent,
    GeolocationComponent,
    MetatagBrowserComponent
  ],
  providers: [
    BuscaService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
