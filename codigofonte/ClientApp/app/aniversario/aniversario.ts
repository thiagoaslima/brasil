export class Aniversario{

    dia: number;
    mes: number;
    nomeMunicipio: string;
    codigoMunicipio: number;
    siglaUF: string;
    
    constructor(siglaUF: string, codigoMunicipio: number, nomeMunicipio: string, dia: number, mes: number){

        this.siglaUF = siglaUF;
        this.codigoMunicipio = codigoMunicipio;
        this.nomeMunicipio = nomeMunicipio;
        this.dia = dia;
        this.mes = mes;
    }
}