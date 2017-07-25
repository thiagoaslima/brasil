import { Component, Output, EventEmitter } from '@angular/core';
import { Localidade } from '../../shared2/localidade/localidade.model';

@Component({
    selector: 'geolocation',
    templateUrl: './geolocation.template.html',
    styleUrls: ['./geolocation.style.css']
})
export class GeolocationComponent {

    @Output() location: EventEmitter<Localidade> = new EventEmitter<Localidade>();

    public isLoading = false;

    handleLoading(value: boolean) {
        this.isLoading = value;
    }

    handleGetLocation(location: Localidade) {
        this.location.emit(location);
    }
}
