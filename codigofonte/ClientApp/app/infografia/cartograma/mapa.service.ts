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

    // TODO: Está consumindo cerca de 0,8 segundos
    private _convertTarsus2TopoJson = (tarsus) => {
        return this._simpler2TopoJson(this._tarsus2Simpler(tarsus));
    }

    private _simpler2TopoJson = (simpler) => {
        let objects = {};
        let estados = simpler[3];
        estados.forEach((estado) => {
            let geometries = [];
            let cod = estado[0];
            let munics = estado[1];
            munics.forEach((munic) => {
                let codMunic = munic[0];
                let arcs = munic[1];
                let type = typeof (arcs[0][0][0]) === 'undefined' ? 'Polygon' : 'MultiPolygon'; // testa se é um array
                let geometry = {
                    arcs: arcs,
                    type: type,
                    properties: {
                        cod: codMunic
                    }
                };
                geometries.push(geometry);
            });
            objects[cod] = {
                type: 'GeometryCollection',
                geometries: geometries
            };
        });
        let topo = {
            type: 'Topology',
            transform: {
                scale: simpler[0],
                translate: simpler[1]
            },
            arcs: simpler[2],
            objects: objects,
            bbox: simpler[4]
        };
        return topo;
    }

    private _tarsus2Simpler = (tarsus) => {
        let myStr = tarsus;
        let replaces = [["\\],\\[0", "a"], ["\\],\\[1", "b"], ["\\],\\[-1", "c"], ["\\],\\[2", "d"], ["\\],\\[-2", "e"], ["\\],\\[3", "f"], ["\\],\\[-3", "g"], ["\\],\\[4", "h"], ["\\],\\[-4", "i"], ["\\],\\[5", "j"], ["\\],\\[-5", "k"], ["\\],\\[6", "l"], ["\\],\\[-6", "m"], ["\\],\\[7", "n"], ["\\],\\[-7", "o"], ["\\],\\[8", "p"], ["\\],\\[-8", "q"], ["\\],\\[9", "r"], ["\\],\\[-9", "s"], ["\\]\\],\\[\\[", "t"], ["\\]\\]", "u"], [",\\[\\[", "v"], ["\\[\\[", "x"], [",0", "A"], [",1", "B"], [",-1", "C"], [",2", "D"], [",-2", "E"], [",3", "F"], [",-3", "G"], [",4", "H"], [",-4", "I"], [",5", "J"], [",-5", "K"], [",6", "L"], [",-6", "M"], [",7", "N"], [",-7", "O"], [",8", "P"], [",-8", "Q"], [",9", "R"], [",-9", "S"]];
        replaces.reverse().forEach((rep) => {
            myStr = myStr.replace(new RegExp(rep[1], 'g'), rep[0].replace(/\\/g, ''));
        });
        let simpler = JSON.parse(myStr);
        return simpler;
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
                center: [(o2+l2)/2, (s2+n2)/2]
            });

        });

        // inverte o mapa na vertical...
        n *= -1; s *= -1;[n, s] = [s, n];

        model.viewBox = [o, s, (l - o), (n - s)].join(" ");

        return model;
    }

}