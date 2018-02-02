import { TraducaoModule } from '../../shared';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyDatePickerModule } from 'mydatepicker';

import { AniversarioComponent, AniversarioService, AniversarioDataService } from '.';
import { KeysPipe } from '../../../utils/keys.pipe';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MyDatePickerModule,
        TraducaoModule,
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
