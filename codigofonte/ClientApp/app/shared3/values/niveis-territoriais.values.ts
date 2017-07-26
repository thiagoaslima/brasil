import { municipios } from '../../../api/municipios';

interface NivelTerritorial {
        label: string,
        codeLength: number
}

interface NiveisTerritoriais {
    pais: NivelTerritorial,
    macrorregiao: NivelTerritorial,
    uf: NivelTerritorial,
    ufSub: NivelTerritorial,
    municipio: NivelTerritorial,
    municipioSub: NivelTerritorial
}

export const niveisTerritoriais: NiveisTerritoriais = {
    pais: {
        label: "pais",
        codeLength: 1
    },
    macrorregiao: {
        // regiões Norte, Nordeste, Centro-Oeste, Sudeste e Sul
        label: "macrorregiao",
        codeLength: 1
    },
    uf: {
        label: "uf",
        codeLength: 2
    },
    ufSub: {
        // ?
        label: "ufSub",
        codeLength: 4
    },
    municipio: {
        label: "municipio",
        codeLength: 6
    },
    municipioSub: {
        // ?
        label: "municipioSub",
        codeLength: 8
    },
}

export const listaNiveisTerritoriais = Object.keys(niveisTerritoriais).map(key => niveisTerritoriais[key].label);