import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { SandboxComponent } from './sandbox.component';
import { SinteseService } from '../sintese/sintese.service';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        SandboxComponent
    ], 
    providers: [
        SinteseService
    ]
})
export class SandboxModule {}