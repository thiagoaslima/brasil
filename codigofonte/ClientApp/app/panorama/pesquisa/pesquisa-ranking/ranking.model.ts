import { Localidade } from '../../../shared';



export class RankingLocalidade{

    indicador: number;
    periodo: string;
    contexto: string;
    localidade: number;

    listaGrupos: ItemRanking[] = [];

    constructor(indicador: number, periodo: string, contexto: string, localidade: number, listaGrupos: ItemRanking[]){
        
        this.indicador = indicador;
        this.periodo = periodo;
        this.contexto = contexto;
        this.localidade = localidade;
        this.listaGrupos = listaGrupos;
    }
    
}

export class ItemRanking{

    constructor(localidade: Localidade, posicao: number, valor: string, fatorMultiplicativo: number = 1, unidadeMedida?: string){

        this.localidade = localidade;
        this.posicao = posicao;
        this.valor = valor;
        this.fatorMultiplicativo = fatorMultiplicativo;
        this.unidadeMedida = unidadeMedida;
    }

    localidade: Localidade
    posicao: number;
    valor: string;
    fatorMultiplicativo: number;
    unidadeMedida: string;
}