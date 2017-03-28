import { PesquisaService } from '../pesquisa.service';
import { RetrieveStrategy } from './strategy.interface';
import { Pesquisa } from '../models/pesquisa.model';

import { Observable } from 'rxjs/Observable';


export class PesquisaStrategy implements RetrieveStrategy<Observable<Pesquisa>> {
    constructor(
        private _service: PesquisaService
    ) { }

    retrieve(pesquisaId: number): Observable<Pesquisa> {
        return this._service.getPesquisa(pesquisaId);
    }
}