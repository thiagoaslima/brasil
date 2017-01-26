import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './core.guard';

import { SharedModule } from '../shared/shared.module';
import { HeaderExampleComponent } from './header-example/header-example.component';
import { SeletorLocalidadeComponent } from './seletor-localidade/seletor-localidade.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    HeaderExampleComponent,
    SeletorLocalidadeComponent
  ],
  exports: [
    HeaderExampleComponent,
    SeletorLocalidadeComponent
  ],
  providers: []
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
