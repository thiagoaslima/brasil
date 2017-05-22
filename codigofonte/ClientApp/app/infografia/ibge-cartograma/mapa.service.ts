import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { TopoJson, TOPOJSON } from '../../shared/topojson.v2';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';

enum Nivel {
    mesmo = 0,
    sub = 1
}

@Injectable()
export class MapaService {
    private _cache = {};

    constructor(
        private _http: Http,
        private _localidadeService: LocalidadeService2,
        @Inject(TOPOJSON) private _topojson
    ) { }

    getMalha(localidadeCodigo: number) {
         if (!this._cache[`${localidadeCodigo}-${Nivel.mesmo}`]) {
            this._cache[`${localidadeCodigo}-${Nivel.mesmo}`] =
                this._getMalha(localidadeCodigo, Nivel.mesmo)
                    .map(malha => this._topojsonFeatures(malha, localidadeCodigo))
                    .map(model => this._prepareGeometries(model))
                    .do(model => {
                        this._cache[`${localidadeCodigo}-${Nivel.mesmo}`] = Observable.of(model)
                    })
                    .share()
        }
        return this._cache[`${localidadeCodigo}-${Nivel.mesmo}`];
        
    }

    getMalhaSubdivisao(localidadeCodigo: number) {
        if (!this._cache[`${localidadeCodigo}-${Nivel.sub}`]) {
            this._cache[`${localidadeCodigo}-${Nivel.sub}`] =
                this._getMalha(localidadeCodigo, Nivel.sub)
                    .map(malha => this._topojsonFeatures(malha, "foo"))
                    .map(model => this._prepareGeometries(model))
                    .do(model => {
                        this._cache[`${localidadeCodigo}-${Nivel.sub}`] = Observable.of(model)
                    })
                    .share()
        }
        return this._cache[`${localidadeCodigo}-${Nivel.sub}`];
    }

    private _getMalha(localidadeCodigo: number, nivel: number) {
        return this._http.get(`malhas/${localidadeCodigo}xxxxx.topojson`)
            .map(res => res.json())
    }

    private _topojsonFeatures(malha, localidadeCodigo) {
        return this._topojson.feature(malha, malha.objects[localidadeCodigo])
    }

    // TODO: Refatorar, _prepareGeometries está consumindo cerca de 0,5 segundos
    private _prepareGeometries(model) {
        // definição inicial do viewbox
        let n = -90; let s = 90; let l = -90; let o = 90;
        let n2, s2, l2, o2;

        model.geometries = [];
        model.centers = [];

        model.features.forEach(feature => {
            const codigoFeature = feature['properties']['codarea'].toString().substr(0, 6);
            const localidade = codigoFeature.length > 2
                ? this._localidadeService.getMunicipioByCodigo(codigoFeature)
                : this._localidadeService.getUfByCodigo(codigoFeature);

            let polygons;
            
            n2 = -90;
            s2 = 90;
            l2 = -90;
            o2 = 90;

            if (feature['geometry'].type == "Polygon") {
                polygons = feature['geometry'].coordinates.map((poly) => {
                    return [poly.map((point) => {
                        if (n2 < point[1]) n2 = point[1];
                        if (s2 > point[1]) s2 = point[1];
                        if (l2 < point[0]) l2 = point[0];
                        if (o2 > point[0]) o2 = point[0];

                        if (n < point[1]) n = point[1];
                        if (s > point[1]) s = point[1];
                        if (l < point[0]) l = point[0];
                        if (o > point[0]) o = point[0];
                        return point.join(",");
                    }).join(" ")];
                });
            } else if (feature['geometry'].type == "MultiPolygon") {
                polygons = feature['geometry'].coordinates.map((MultiPoly) => {
                    return MultiPoly.map((poly) => {
                        return poly.map((point) => {
                            if (n2 < point[1]) n2 = point[1];
                            if (s2 > point[1]) s2 = point[1];
                            if (l2 < point[0]) l2 = point[0];
                            if (o2 > point[0]) o2 = point[0];

                            if (n < point[1]) n = point[1];
                            if (s > point[1]) s = point[1];
                            if (l < point[0]) l = point[0];
                            if (o > point[0]) o = point[0];
                            return point.join(",");
                        }).join(" ");
                    });
                });
            }

            model.geometries.push({
                codigo: localidade.codigo,
                nome: localidade.nome,
                link: localidade.link,
                polys: polygons,
                center: [(o2+l2)/2, (s2+n2)/2],
                bbox: [o2, s2,  l2, n2]
            });

        });

        model.bbox = [o, s, l, n]; // salva os extremos naturais do mapa
        // estende os extremos em 10% da maior dimensão
        let dx = model.bbox[2] - model.bbox[0];
        let dy = model.bbox[1] - model.bbox[3];
        let d = dx > dy ? dx*0.05 : dy*0.05;
        model.bbox[0] -= d;
        model.bbox[1] -= d;
        model.bbox[2] += d;
        model.bbox[3] += d;

        // cria o viewBox de modo a inverter norte e sul, pois o mapa será invertido na vertical
        model.viewBox = [model.bbox[0], -model.bbox[3], model.bbox[2]-model.bbox[0], model.bbox[3]-model.bbox[1]].join(" ");

        return model;
    }

}