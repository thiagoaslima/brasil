export const NiveisTerritoriais = {
    pais: {
        label: "pais",
        codeLength: 0
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
} as {[label: string]: {
        label: string,
        codeLength: number
    }}