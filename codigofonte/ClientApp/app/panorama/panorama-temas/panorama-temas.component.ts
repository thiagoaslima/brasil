import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html',
    styleUrls: ['./panorama-temas.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaTemasComponent implements OnInit {
    @Input() dados;
    @Input() localidade;

    tipoGrafico = "bar";
    // dadosIndicador = {"1991": "0.639", "2000": "0.716", "2010": "0.799"};
    dadosIndicador = [
                      {1991: "0.639", 2000: "0.716", 2010: "0.799"},
                      {1991: "0.739", 2000: "0.816", 2010: "0.599"},
                      {1991: "0.539", 2000: "0.616", 2010: "0.899"},
                      {1991: "0.839", 2000: "0.516", 2010: "0.699"}
                    ];
    nomeIndicador = ["Superior","Médio","Fundamental","Pré-escolar"];
    isGraficoCarregando = false;
    
    constructor() { }

    ngOnInit() { }
}