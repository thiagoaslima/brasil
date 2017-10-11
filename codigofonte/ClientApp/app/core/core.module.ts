import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './core.guard';

import { SharedModule } from '../shared/shared.module';
import { SharedModule2 } from '../shared2/shared.module';
import { SeletorLocalidadeComponent } from './seletor-localidade/seletor-localidade.component';
import { SeletorLocalidadeService } from './seletor-localidade/seletor-localidade.service';
import { BuscaComponent } from './busca/busca.component';
import { BuscaService } from './busca/busca.service';
import { BuscaCompletaService } from './busca/busca-completa.service';
import { TituloBrowserComponent } from './titulo-browser/titulo-browser.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { MetatagBrowserComponent } from './metatag-browser/metatag-browser.component';
import { Page404Component } from './page404/page404.component';
import { ModalErroComponent } from './modal-erro/modal-erro.component';
import { ModalErrorService } from './modal-erro/modal-erro.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedModule2,
  ],
  declarations: [
    SeletorLocalidadeComponent,
    BuscaComponent,
    TituloBrowserComponent,
    GeolocationComponent,
    MetatagBrowserComponent,
    Page404Component,
    ModalErroComponent
  ],
  exports: [
    SeletorLocalidadeComponent,
    BuscaComponent,
    TituloBrowserComponent,
    GeolocationComponent,
    MetatagBrowserComponent,
    ModalErroComponent
  ],
  providers: [
    BuscaService,
    BuscaCompletaService,
    SeletorLocalidadeService,
    ModalErrorService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
