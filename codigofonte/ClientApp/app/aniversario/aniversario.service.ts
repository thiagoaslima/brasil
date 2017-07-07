import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Aniversario } from './aniversario';
import { AniversarioDataService } from './aniversario.data-service';
import { LocalidadeService3 } from '../shared3/services';


@Injectable()
export class AniversarioService {

    constructor(
        private aniversarioDataService: AniversarioDataService,
        private localidadeService: LocalidadeService3
    ) { }

    getAniversariantes(siglaUF: string, mes: string){

        return this.aniversarioDataService.getAniversario(siglaUF, '01', mes, '31', mes)
            .map(listaAniversarios => 
                listaAniversarios.map( aniversario => 
                    new Aniversario(this.localidadeService.getByCodigo(aniversario['codigoMunicipio'])[0],  aniversario['diaAniversario'], aniversario['mesAniversario']) 
                )
            );
    }

}