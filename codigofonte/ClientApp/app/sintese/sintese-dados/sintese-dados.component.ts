import { Component, Input } from '@angular/core';

@Component({
    selector: 'sintese-dados',
    templateUrl: 'sintese-dados.template.html',
    styleUrls: ['sintese-dados.style.css']
})
export class SinteseDadosComponent {

    @Input() content;
    @Input() baseURL;

}