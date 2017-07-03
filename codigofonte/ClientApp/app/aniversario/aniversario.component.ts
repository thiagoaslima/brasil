import { Component, OnInit } from '@angular/core';

import { AniversarioService } from './aniversario.service';


@Component({
    selector: 'aniversario',
    templateUrl: 'aniversario.component.html',
    styleUrls: ['aniversario.component.css']
})
export class AniversarioComponent implements OnInit {

    constructor(private aniversarioService: AniversarioService) { }

    ngOnInit() { }
}