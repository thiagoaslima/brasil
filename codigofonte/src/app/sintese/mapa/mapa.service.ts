import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

enum Nivel {
    mesmo = 1,
    sub = 1
}

@Injectable()
export class MapaService {

    constructor(
        private _http: Http
    ) { }

    getMalha(localidadeCodigo: number) {
        return this._getMalha(localidadeCodigo, Nivel.mesmo);
    }

    getMalhaSubdivisao(localidadeCodigo: number) {
        return this._getMalha(localidadeCodigo, Nivel.sub);
    }

    private _getMalha(localidadeCodigo: number, nivel: number) {
        return this._http.get(`http://servicomapas.ibge.gov.br/api/mapas/${localidadeCodigo}/${nivel}`)
            .map(res => res.json())
            .map(({Tarsus}) => this._convertTarsus2TopoJson(Tarsus));
    }

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
}