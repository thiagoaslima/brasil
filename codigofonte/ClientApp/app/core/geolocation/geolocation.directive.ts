import { Directive, EventEmitter, HostBinding, HostListener, Output, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
    Localidade,
    LocalidadeService3
} from '../../shared';

import {
    ModalErrorService
} from '..';


/**
 * Componente responsável por exibir um botão que, ao ser clicado, recupera a cidade atual do usuário a lança no evento location.
 * 
 * @export
 * @class GeolocationComponent
 */
@Directive({
    selector: '[geolocation]'
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
    isBrowser;

    @HostBinding('attr.teste') teste = 'ok';

    constructor(
        private _localidadeService: LocalidadeService3,
        private modalErrorService: ModalErrorService,
        @Inject(PLATFORM_ID) platformId,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    /**
     * Obtém as coordenadas a posição atual do usuário.
     *
     * @memberOf GeolocationComponent
     */
    @HostListener('click') getGeoLocation() {

        let options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        if (this.isBrowser) {
            this.isLoading = true;
            this.onLoading.emit(this.isLoading);

            navigator.geolocation.getCurrentPosition(
                (position => {
                    return this.getLocalidade(position);
                }),
                (err => {
                    console.error(`ERROR (${err.code}): ${err.message} `);
                    this.modalErrorService.showError();
                }),
                options
            );
            
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

        this._localidadeService.getMunicipioByCoordinates(position.coords.latitude, position.coords.longitude).subscribe(municipio => {
            this.isLoading = false;
            this.onLoading.emit(this.isLoading);

            this.onGetLocation.emit(municipio);
        },
        error => {
            console.error(error);
            this.modalErrorService.showError();
        });
    }
}
