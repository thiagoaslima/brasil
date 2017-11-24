import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'empty',
    template: `<br/><br/><br/><br/><br/><br/><br/><br/><h1>OLA, MUNDO</h1><h2>Teste!!</h2>`
})

export class EmptyComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}