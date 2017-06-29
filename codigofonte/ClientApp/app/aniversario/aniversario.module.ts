import { NgModule } from '@angular/core';

import { AniversarioComponent } from './aniversario.component';
import { AniversarioService } from './aniversario.service';

@NgModule({
    imports: [],
    exports: [AniversarioComponent],
    declarations: [AniversarioComponent],
    providers: [AniversarioService],
})
export class AniversarioModule { }
