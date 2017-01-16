import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `
        <header-example></header-example>
        <h1>{{title}}</h1>
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
    title = 'Angular 2';
}