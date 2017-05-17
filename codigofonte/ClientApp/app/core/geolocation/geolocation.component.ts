import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';


/**
 * Componente responsável por exibir um botão que, ao ser clicado, recupera a cidade atual do usuário a lança no evento location.
 * 
 * @export
 * @class GeolocationComponent
 */
@Component({
    selector: 'geolocation',
    template: `<button (click)="getGeoLocation()">Geolocalização</button>`
})
export class GeolocationComponent {

    /**
     * Evento que representa a obtenção do posicionamento do usuário.
     * 
     * @type {EventEmitter<Localidade>}
     * @memberOf GeolocationComponent
     */
    @Output() location: EventEmitter<Localidade> = new EventEmitter<Localidade>();


    constructor(private _localidadeService: LocalidadeService2){}

    /**
     * Obtém as coordenadas a posição atual do usuário.
     * 
     * @private
     * 
     * @memberOf GeolocationComponent
     */
    private getGeoLocation() {

        navigator.geolocation.getCurrentPosition(position => this.getLocalidade(position));
    }

    /**
     * Obtém a cidade correspondente ao posição do usuário e lança o evento location.
     * 
     * @private
     * @param {any} position coordenadas da posição do usuário em latitude e longitude.
     * 
     * @memberOf GeolocationComponent
     */
    private getLocalidade(position){

        this._localidadeService.getMunicipioByCoordinates(position.coords.latitude, position.coords.longitude).subscribe(municipio => {

            this.location.emit(municipio);
        });
    }
}