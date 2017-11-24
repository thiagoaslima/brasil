import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `
<titulo-browser></titulo-browser>
<metatag-browser></metatag-browser>
<barra-gov></barra-gov>

<router-outlet></router-outlet>

<!-- 
<qrcode></qrcode>
-->
`,
    styles: [`
@media (max-width: 767px) {
    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */
    .body-content {
        padding-top: 50px;
    }
}
`]
})
export class AppComponent {
}
