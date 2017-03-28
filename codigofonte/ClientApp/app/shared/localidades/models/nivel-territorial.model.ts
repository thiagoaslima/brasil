export class NivelTerritorial {
   constructor(
       public nome: string, 
       public tamanhoCodigo: number
    ) {}
}

export const NiveisTerritorais = {
    pais: new NivelTerritorial('pais', 0),
    uf: new NivelTerritorial('uf', 2),
    municipio: new NivelTerritorial('municipio', 6)
}