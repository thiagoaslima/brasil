import { Component } from '@angular/core';

@Component({
    selector: 'sintese-header',
    templateUrl: 'sintese-header.template.html',
    styleUrls: ['sintese-header.style.css']
})
export class SinteseHeaderComponent {

    ativo = 'grafico';

    ativar(tipo){
        this.ativo = tipo;
    }

}