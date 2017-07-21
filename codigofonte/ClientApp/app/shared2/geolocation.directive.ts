import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { isBrowser } from 'angular2-universal';

import { Localidade } from './localidade/localidade.model';
import { LocalidadeService2 } from './localidade/localidade.service';


/**
 * Componente responsável por exibir um botão que, ao ser clicado, recupera a cidade atual do usuário a lança no evento location.
 * 
 * @export
 * @class GeolocationComponent
 */
@Directive({
    selector: '[getLocation]'
})
export class GeolocationDirective {

    /**
     * Evento que representa a obtenção do posicionamento do usuário.
     * 
     * @type {EventEmitter<Localidade>}
     * @memberOf GeolocationComponent
     */
    @Output() onGetLocation: EventEmitter<Localidade> = new EventEmitter<Localidade>();
    @Output() onLoading: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    isLoading = false;

    @HostBinding('attr.teste') teste = 'ok';

    constructor(private _localidadeService: LocalidadeService2) { }

    /**
     * Obtém as coordenadas a posição atual do usuário.
     *
     * @memberOf GeolocationComponent
     */
    @HostListener('click') getGeoLocation() {
        debugger;
        if (isBrowser) {
            
            this.isLoading = true;
            this.onLoading.emit(this.isLoading);

            navigator.geolocation.getCurrentPosition(position => {
                debugger;
                return this.getLocalidade(position);
            });
        }
    }

    /**
     * Obtém a cidade correspondente ao posição do usuário e lança o evento location.
     *
     * @private
     * @param {any} position coordenadas da posição do usuário em latitude e longitude.
     *
     * @memberOf GeolocationComponent
     */
    private getLocalidade(position) {
        debugger;
        this._localidadeService.getMunicipioByCoordinates(position.coords.latitude, position.coords.longitude).subscribe(municipio => {
            debugger;
            this.isLoading = false;
            this.onLoading.emit(this.isLoading);

            this.onGetLocation.emit(municipio);
        });
    }
}
