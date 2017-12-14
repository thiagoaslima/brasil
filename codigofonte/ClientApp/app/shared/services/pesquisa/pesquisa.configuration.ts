import { Injectable } from '@angular/core';
import { niveisTerritoriais } from '..';

@Injectable()
export class PesquisaConfiguration {
    get validas() {
        return [1, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 10053, 10054, 10055, 10056, 10057, 10060, 10061, 10062, 10063, 10064, 10066, 10070];
    }

    isValida(pesquisaId: number) {
        return this.validas.indexOf(pesquisaId) > -1;
    }

    comDados(nivelTerritorial: string) {
        switch(nivelTerritorial) {
            case niveisTerritoriais.municipio.label:
                return this.validas;

            case niveisTerritoriais.uf.label:
                return this.validas;

            case niveisTerritoriais.pais.label:
                return [23, 24, 30, 34, 44, 46, 49, 50, 51, 52, 10056, 10070];
        }
    }
};
