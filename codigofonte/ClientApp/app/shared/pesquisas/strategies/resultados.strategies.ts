import { ResultadoService } from '../resultado.service';
import { RetrieveStrategy } from './strategy.interface';
import { Resultado } from '../models/resultado.model';

import { Observable } from 'rxjs/Observable';


export class ResultadoStrategy implements RetrieveStrategy<Observable<Resultado>> {
    constructor(
        private _service: ResultadoService
    ) { }

    retrieve(pesquisaId: number, indicadorId: number, codigoLocalidade: number): Observable<Resultado> {
        return this._service.getResultadoIndicador(pesquisaId, indicadorId, codigoLocalidade);
    }
}
