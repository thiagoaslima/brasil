import { NgModule } from '@angular/core';

import { SandboxComponent } from './sandbox.component';
import { SinteseService } from '../sintese/sintese.service';

@NgModule({
    declarations: [
        SandboxComponent
    ], 
    providers: [
        SinteseService
    ]
})
export class SandboxModule {}