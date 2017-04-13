import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './core.guard';

import { SharedModule } from '../shared/shared.module';
import { SeletorLocalidadeComponent } from './seletor-localidade/seletor-localidade.component';
import { BuscaComponent } from './busca/busca.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    SeletorLocalidadeComponent,
    BuscaComponent
  ],
  exports: [
    SeletorLocalidadeComponent,
    BuscaComponent
  ],
  providers: []
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
