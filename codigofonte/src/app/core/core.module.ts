import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './core.guard';

import { HeaderExampleComponent } from './header-example/header-example.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HeaderExampleComponent
  ],
  exports: [
    HeaderExampleComponent
  ],
  providers: []
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
