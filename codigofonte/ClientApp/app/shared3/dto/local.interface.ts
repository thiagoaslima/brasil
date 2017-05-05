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
    codigoUf: 52,
    nome: string,
    slug: string,
    microrregiao: number
}

export type LocalDTO = PaisDTO | UfDTO | MunicipioDTO; 