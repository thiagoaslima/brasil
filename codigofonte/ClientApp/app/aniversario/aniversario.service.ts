import { Observable } from 'rxjs/Rx';
import { Aniversario } from './aniversario';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';


const headers = new Headers({ 'accept': '*/*'});
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class AniversarioService {

    constructor(private http:Http) { }


    public getAniversario(siglaUF: string = '', diaInicioPeriodo: string = '0', mesInicioPeriodo: string = '0', diaFimPeriodo: string = '0', mesFimPeriodo: string = '0'){

        return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/aniversarios/${siglaUF}?diade=${diaInicioPeriodo}&mesde=${mesInicioPeriodo}&diaate=${diaFimPeriodo}&mesate=${mesFimPeriodo}`, options)
                        .map( res => res.json() )
                        .map( json => json.map(aniversario => new Aniversario(aniversario['uf'], aniversario['codigo'], aniversario['nome'], aniversario['dia'], aniversario['mes'])) );
    }
}