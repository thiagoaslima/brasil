import { Component, Input, OnChanges, Inject } from '@angular/core';
import { SinteseService } from '../sintese.service';
import { TopoJson, TOPOJSON } from '../../shared/topojson.v2';

@Component({
    selector: 'mapa',
    templateUrl: 'mapa.template.html',
    styleUrls: [ 'mapa.style.css' ]
})

export class MapaComponent implements OnChanges {

    @Input() codlocal;
    public localHover = '';

    public data;
    public geom;
    public svgMapPoly;

    constructor(
        private _sinteseService: SinteseService,
        @Inject(TOPOJSON) private _topojson
    ) {
    }


    ngOnChanges(evt) {

        this._sinteseService.getMalha(this.codlocal.substr(0, 2), 1)
            .subscribe((malha) => {

                this.data = this._topojson.feature(malha, malha.objects[this.codlocal.substr(0, 2)]);

                let myGeom;
                let n = -90;
                let s = 90;
                let l = -90;
                let o = 90;
                this.data.geometry = this.data.features.map((ft) => {
                    myGeom = {};
                    myGeom.codigo = ft.properties.cod;
                    myGeom.nome = "-";
                    myGeom.classe = this.codlocal.substr(0, 6) == ft.properties.cod.toString().substr(0, 6) ? "checked" : "unchecked";
                    if (ft.geometry.type == "Polygon") {
                        myGeom.polys = ft.geometry.coordinates.map((poly) => {
                            return [ poly.map((pt) => {
                                if (n < pt[1]) n = pt[1];
                                if (s > pt[1]) s = pt[1];
                                if (l < pt[0]) l = pt[0];
                                if (o > pt[0]) o = pt[0];
                                return pt.join(",");
                            }).join(" ") ];
                        })
                    } else if (ft.geometry.type == "MultiPolygon") {
                        myGeom.polys = ft.geometry.coordinates.map((MultiPoly) => {
                            return MultiPoly.map((poly) => {
                                return poly.map((pt) => {
                                    if (n < pt[1]) n = pt[1];
                                    if (s > pt[1]) s = pt[1];
                                    if (l < pt[0]) l = pt[0];
                                    if (o > pt[0]) o = pt[0];
                                    return pt.join(",");
                                }).join(" ");
                            })
                        })
                    }
                    return myGeom;
                });

                // inverte o mapa na vertical...
                n *= -1;
                s *= -1;
                let aux = n;
                n = s;
                s = aux;

                this.data.viewBox = [o, s, (l-o), (n-s)].join(" ");

            });
            
    }

    over(cod){
        console.log(cod);
        this.localHover = cod.toString();
    }

}