import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyDatePickerModule } from 'mydatepicker';

import { AniversarioComponent } from './aniversario.component';
import { AniversarioService } from './aniversario.service';
import { AniversarioDataService } from './aniversario.data-service';
import { KeysPipe } from '../utils/keys.pipe';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MyDatePickerModule
    ],
    exports: [AniversarioComponent],
    declarations: [
        AniversarioComponent,
        KeysPipe
    ],
    providers: [
        AniversarioService,
        AniversarioDataService
    ],
})
export class AniversarioModule { }
