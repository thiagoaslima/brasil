import { Component } from '@angular/core';

@Component({
    selector: 'home-example',
    template: `
        <h1>Home Example</h1>
        <a [routerLink]="['lazy']">Lazy</a>
    `
})
export class HomeExampleComponent {

}