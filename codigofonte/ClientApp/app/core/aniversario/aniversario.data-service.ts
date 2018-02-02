import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigService } from '../../shared';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

@Injectable()
export class AniversarioDataService {

    constructor(
        private http:Http,
        private configService: ConfigService
    ) { }

    public getAniversario(siglaUF: string = '', diaInicioPeriodo: string = '0', mesInicioPeriodo: string = '0', diaFimPeriodo: string = '0', mesFimPeriodo: string = '0'){

        let url = `${this.configService.getConfigurationValue('ENDPOINT_SERVICO_DADOS')}/v1/localidades/aniversarios/${siglaUF}?diade=${diaInicioPeriodo}&mesde=${mesInicioPeriodo}&diaate=${diaFimPeriodo}&mesate=${mesFimPeriodo}`;

        return this.http.get(url, options)
                        .retry(3)
                        .map( res => res.json() )
                        .map( json => json.map(aniversario => {
                                
                                return {

                                    siglaUF: aniversario['uf'], 
                                    codigoMunicipio: aniversario['codigo'], 
                                    nomeMunicipio: aniversario['nome'], 
                                    diaAniversario: aniversario['dia'], 
                                    mesAniversario: aniversario['mes']
                                }
                            })
                        );
    }
}