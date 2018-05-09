import { Pipe, PipeTransform } from "@angular/core";


export var isFloat: (n: any) => boolean = (n: any) => Number(n) === n && n % 1 !== 0;

/*
 * Formata o resultado de um indicador conforme os padrões IBGE.
*/
@Pipe({
    name: "resultado"
})
export class ResultadoPipe implements PipeTransform {

    private CONSTANTES = {

        TIPO_NUMERICO: "N",
        TIPO_MONETARIO: "$",

        UNIDADE_PERCENTUAL: "%",
        UNIDADE_AREA: "km²",
        UNIDADE_PESSOAS: "pessoas",
        UNIDADE_MONETARIA: "R$",

        // resultados padronizados conforme o código do valor do indicador
        CASOS_ESPECIAIS_RESULTADO: {
            "99999999999999": "Ignorado",
            "99999999999998": "Não disponível",
            "99999999999997": "Não informado",
            "99999999999996": "Não existente",
            "99999999999995": "*",
            "99999999999992": "-",
            "99999999999991": "-",
        }
    };

    /**
     * Formata um dado resultado de indicador de pesquisa segundo os padrões estabelecidos para sua unidade de medida.
     *
     * @value: any - valor a ser formatado.
     * @unidade?: string - unidade de medida do indicador (opcional).
     */
    transform(valor: any, unidade?: string, tipo?: string): any {

        if(!this.isNumber(valor)) {
            return valor;
        }

        // verifica se o valor possui um caso especial definido
        if(this.isCasoEspecial(valor)) {
            return this.getResultadoParaCasoEspecial(valor);
        }

        if(this.isUnidadePercentual(unidade)) {
            return String(valor).replace(".", ",");
        }

        if(this.isUnidadeArea(unidade)) {
            return this.formatarComoNumero(Number(valor));
        }

        if(this.isUnidadePessoas(unidade)) {
            return this.formatarComoNumero(Number(valor));
        }

        if(this.isUnidadeMonetaria(unidade)) {
            return this.formatarComoNumero(valor, ".", true);
        }

        if(this.isTipoNumerico(tipo)) {
            return this.formatarComoNumero(valor);
        }

        if(this.isTipoMonetario(tipo)) {
            return this.formatarComoNumero(valor, ".", true);
        }


        return String(valor).replace(".", ",");
    }

    private formatarComoNumero(numero: number, separadorMilhar: string = ".", isMonetario: boolean = false): string {

        let sinal: string = "";
        let valorNumerico: number = numero;
        if (valorNumerico < 0) {
            valorNumerico = Math.abs(valorNumerico);
            sinal = "-";
        }
        let valueStr: string = isMonetario ? Number(valorNumerico).toFixed(2).toString() : valorNumerico.toString();
        let [parteInteira, parteDecimal] = valueStr.split(".");

        let inicio: number = 0;
        let fim: number = parteInteira.toString().length % 3;
        let resultado:any[] = [];

        for (var curr: number = inicio; curr < parteInteira.toString().length; curr = fim, fim += 3) {

            if (fim === 0) {
                continue;
            }
            resultado.push(parteInteira.toString().substring(curr, fim));
        }

        return parteDecimal ? sinal + [resultado.join(separadorMilhar), parteDecimal].join(",") : sinal + resultado.join(separadorMilhar);
    }

    private isTipoMonetario(tipo: string): boolean {
        return tipo === this.CONSTANTES.TIPO_MONETARIO;
    }

    private isTipoNumerico(tipo: string): boolean {
        return tipo === this.CONSTANTES.TIPO_NUMERICO;
    }

    private isUnidadePercentual(unidade: string): boolean {
        return unidade === this.CONSTANTES.UNIDADE_PERCENTUAL;
    }

    private isUnidadeArea(unidade: string): boolean {
        return unidade === this.CONSTANTES.UNIDADE_AREA;
    }

    private isUnidadePessoas(unidade: string): boolean {
        return unidade === this.CONSTANTES.UNIDADE_PESSOAS;
    }

    private isUnidadeMonetaria(unidade: string): boolean {
        return unidade === this.CONSTANTES.UNIDADE_MONETARIA;
    }

    private isCasoEspecial(valor: string): boolean {
        return !!this.getResultadoParaCasoEspecial(valor);
    }

    private isNumber(value: string): boolean {
        return !isNaN(Number(value));
    }

    /**
     * Recupera o resultado padronizado definido para os casos especias de valores.
     */
    private getResultadoParaCasoEspecial(valor: string): string {

        // caso não possua valor, exibir o traço "-"
        if(!valor) {

            return "-";
        }

        return this.CONSTANTES.CASOS_ESPECIAIS_RESULTADO[valor];
    }

}