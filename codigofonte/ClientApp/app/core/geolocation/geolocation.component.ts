import { TraducaoService } from '../../traducao/traducao.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { Localidade } from '../../shared2/localidade/localidade.model';

@Component({
    selector: 'geolocation',
    templateUrl: './geolocation.template.html',
    styleUrls: ['./geolocation.style.css']
})
export class GeolocationComponent {

    @Output() location: EventEmitter<Localidade> = new EventEmitter<Localidade>();

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _traducaoServ: TraducaoService
    ) {}

    public isLoading = false;

    handleLoading(value: boolean) {
        this.isLoading = value;
    }

    handleGetLocation(location: Localidade) {
        this.location.emit(location);
    }
}
