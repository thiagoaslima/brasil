export interface PeriodoServer {
  fonte: string[],
  nota: string[],
  periodo: string,
  publicacao: string
}

export interface PesquisaServer {
  id: number,
  nome: string,
  descricao: string,
  contexto: string | null,
  observacao: string | null,
  periodos: PeriodoServer[]
}

export interface IndicadorServer {
  id: number,
  posicao: string,
  indicador: string,
  classe: "T" | "I"| null,
  unidade: {
    id: string,
    classe: string,
    multiplicador: number
  },
  children: IndicadorServer[],
  nota: string[]
}


interface ResIndicadorServer {
  localidade: string,
  res: { [periodo: string]: string|null }
}
export interface ResultadoIndicadorServer {
    id: number,
    res: ResIndicadorServer[]
}

interface ResLocalidadeServer {
  indicador: number,
  res: { [periodo: string]: string|null }
}
export interface ResultadoLocalidadeServer {
    localidade: string,
    res: ResLocalidadeServer[]
}