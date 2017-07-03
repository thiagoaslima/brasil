import { Injectable } from '@angular/core';

import { Http } from '@angular/http';


@Injectable()
export class AniversarioService {

    constructor(private http:Http) { }


    public getAniversario(siglaUF: string = '0', diaInicioPeriodo: string = '0', mesInicioPeriodo: string = '0', diaFimPeriodo: string = '0', mesFimPeriodo: string = '0'){

        return this.http.get('http://cidades.ibge.gov.br/painel/aniverservice.php?uf=${siglaUF}&mes=${mesInicioPeriodo}&dia=${diaInicioPeriodo}&atemes=${mesFimPeriodo}&atedia=${diaFimPeriodo}');
    }
}