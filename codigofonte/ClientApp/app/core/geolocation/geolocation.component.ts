import { Component, EventEmitter, Output } from '@angular/core';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';


@Component({
    selector: 'geolocation',
    template: `<button (click)="getGeoLocation()">Geolocalização</button>`
})

export class GeolocationComponent {

    @Output() location: EventEmitter<Localidade> = new EventEmitter<Localidade>();

    constructor(private _localidadeService: LocalidadeService2){}

    private getGeoLocation() {

        navigator.geolocation.getCurrentPosition(coords => this.location.emit(this.getLocalidade(coords)));
    }

    private getLocalidade(coords): Localidade{

        //TODO: Obter sigla da UF e Nome do Município, dadas suas coordenadas
        console.log("Latitude: " + coords.coords.latitude + " - Longitude: " + coords.coords.longitude + ". Método GeolocationComponent.getLocalidade() não implementado. Redirecionando para o Rio de Janeiro.");

        return this._localidadeService.getMunicipioBySlug('rj', 'rio-de-janeiro');
    }
}