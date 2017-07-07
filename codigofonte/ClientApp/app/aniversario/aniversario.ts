import { Localidade } from '../shared3/models';


export class Aniversario{

    localidade: Localidade;
    dia: number;
    mes: number;

    
    constructor(localidade: Localidade, dia: number, mes: number){

        this.localidade = localidade;
        this.dia = dia;
        this.mes = mes;
    }
}