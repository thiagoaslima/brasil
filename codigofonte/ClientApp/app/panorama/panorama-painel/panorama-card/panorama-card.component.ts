import { Component, Input, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'panorama-card',
    templateUrl: './panorama-card.template.html',
    styleUrls: ['./panorama-card.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaCardComponent implements OnInit, OnChanges {
    @Input() dados;
    @Input() localidade;

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes) {
       console.log('card', changes, this);
    }
}