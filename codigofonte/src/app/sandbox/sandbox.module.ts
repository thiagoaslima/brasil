import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SandboxComponent } from './sandbox.component';
import { SinteseService } from '../sintese/sintese.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SandboxComponent
    ], 
    providers: [
        SinteseService
    ]
})
export class SandboxModule {}