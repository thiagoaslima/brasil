import { Pipe, PipeTransform } from '@angular/core';


let isFloat = (n) => Number(n) === n && n%1 !== 0;
/*
 * Recebe uma string, transforma em float e 
 * insere formatação com pontos e vírgulas
*/
@Pipe({
    name: 'resultado'
})
/*
99999999999999 - Ignorado
99999999999998 - Não disponível
99999999999997 - Não informado
99999999999996 - Não existente
99999999999995 - *
99999999999992 - -
99999999999991 - -
- - -
(NULL) - -
*/    
export class ResultadoPipe implements PipeTransform {
    transform(value: any, unidade?: string): any {

        // let unidades = [
        //     'unidades',
        //     'frutos',
        //     'casamentos',
        //     'divórcios',
        //     'separações',
        //     'estabelecimentos',
        //     'equipamentos',
        //     'pessoas',
        //     'domicílios',
        //     'famílias',
        //     'docentes',
        //     'matrículas',
        //     'escola',
        //     'automóveis',
        //     'caminhões',
        //     'caminhões trator',
        //     'caminhonetes',
        //     'caminhonetas',
        //     'micro-ônibus',
        //     'motocicletas',
        //     'motonetes',
        //     'ônibus',
        //     'tratores de roda',
        //     'utilitários',
        //     'veículos',
        //     'agências',
        //     'óbitos',
        //     'notificações',
        //     'cabeças',
        //     'unidades habitacionais',
        //     'leitos'
        // ];

        let unidades = ['r$'];


        let float = (typeof(unidade) != "undefined" && unidade != null) ? (unidades.indexOf(unidade.toLocaleLowerCase()) >= 0 ? true : false) : false; 

        switch (value) {
            case '99999999999999':
                return 'Ignorado';
            case '99999999999998':
                return 'Não disponível';
            case '99999999999997':
                return 'Não informado';
            case '99999999999996':
                return 'Não existente';
            case '99999999999995':
                return '*';
            case '99999999999992':
            case '99999999999991':
            case '-':
            case null:
                return '-';
            
            default:
                if (!isNaN(Number(value))) {
                    let _value = Number(value);
                    //let valueStr = (float || (float === undefined && isFloat(value))) ? (<number>value).toFixed(2).toString() : value.toString();
                    let valueStr = (float === true) ? _value.toFixed(2).toString() : value.toString();
                    //return valueStr.replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.");
                    let [parteInteira, parteDecimal] = valueStr.split('.');
                    parteInteira = this.adicionaSeparadorMilhares(parteInteira, '.');
                    return parteDecimal ? [parteInteira, parteDecimal].join(',') : parteInteira;
                } else {
                    return value;
                }
        }
    }
    private adicionaSeparadorMilhares(n:string, separador=' ') {
        let start = 0;
        let next = n.length%3;
        let r = [];
        for(var curr = start; curr < n.length; curr=next, next+=3) {
            if(next == 0){ continue; }
            r.push(n.substring(curr,next));
        }
        return r.join(separador);
    }
}