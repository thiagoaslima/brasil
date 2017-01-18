import { NgModule } from '@angular/core';

import { SinteseComponent } from './sintese.component';
import { SinteseHeaderComponent } from './sintese-header/sintese-header.component';
import { SinteseDadosComponent } from './sintese-dados/sintese-dados.component';

@NgModule({
    declarations: [
        SinteseComponent,
        SinteseHeaderComponent,
        SinteseDadosComponent
    ]
})
export class SinteseModule {}