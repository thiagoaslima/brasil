import { NgModule } from '@angular/core';

import { WindowEventsService } from './window-events.service';
import { ScrollDirective } from './scroll.directive';
import { OnSreenDirective } from './onscreen.directive';

const directives = [
    ScrollDirective,
    OnSreenDirective
]

@NgModule({
    declarations: [
        ...directives
    ],
    exports: [
        ...directives
    ],
    providers: [
        WindowEventsService
    ]
})
export class WindowEventsModule {}
