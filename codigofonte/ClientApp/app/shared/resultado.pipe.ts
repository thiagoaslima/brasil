import { Pipe, PipeTransform } from "@angular/core";

let isFloat = (n) => Number(n) === n && n % 1 !== 0;

/*
 * Formata o resultado de um indicador conforme os padrões IBGE.
*/
@Pipe({
    name: "resultado"
})
export class ResultadoPipe implements PipeTransform {

    private CONSTANTES = {
        SIMBOLO_MONETARIO: "$",
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
    transform(value: any, unidade?: string): any {

        let resultadoCasoEspecial: string = this.getResultadoCasoEspecial(value);
        if(!!resultadoCasoEspecial) {

            return resultadoCasoEspecial;
        }

        if(this.isNumber(value)) {

            let valor: number = Number(value);
            var sinal: string = "";
            if (valor < 0) {
                valor = Math.abs(valor);
                sinal = "-";
            }
            let valueStr: string = this.isTipoMonetario(unidade) ? valor.toFixed(2).toString() : value.toString();
            let [parteInteira, parteDecimal] = valueStr.split(".");
            parteInteira = this.incluirSeparadorMilhar(parteInteira, ".");

            return parteDecimal ? [parteInteira, parteDecimal].join(",") : sinal + parteInteira;
        }


        return value;
    }

    private incluirSeparadorMilhar(n: string, separador: string = " "): string {

        let start: number = 0;
        let next: number = n.length % 3;
        let r:any[] = [];

        for (var curr: number = start; curr < n.length; curr = next, next += 3) {

            if (next === 0) {
                continue;
            }
            r.push(n.substring(curr, next));
        }

        return r.join(separador);
    }

    private isNumber(value: string): boolean {

        return !isNaN(Number(value));
    }


    private isTipoMonetario(unidade: string): boolean{

        if(!unidade) {

            return false;
        }

        return unidade.trim().toUpperCase() === this.CONSTANTES.SIMBOLO_MONETARIO;
    }


    private getResultadoCasoEspecial(valor: string): string {

        if(!valor) {

            return "-";
        }

        return this.CONSTANTES.CASOS_ESPECIAIS_RESULTADO[valor];
    }

}