import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html',
    styleUrls: ['./panorama-temas.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaTemasComponent implements OnInit {
    @Input() dados;
    @Input() localidade;

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.dados && Boolean(changes.dados.currentValue)) {
            
        }
    }
}