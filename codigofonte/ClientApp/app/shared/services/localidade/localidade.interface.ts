interface PaisDTO {
    codigo: number
    nome: string
    slug: string
    codigoCapital: number
}

interface UfDTO {
    codigo: number
    nome: string
    slug: string
    sigla: string
    codigoCapital: number    
}

interface MunicipioDTO {
    codigo: number,
    codigoUf: number,
    nome: string,
    slug: string,
    microrregiao: number
}

export type LocalidadeDTO = PaisDTO | UfDTO | MunicipioDTO; 