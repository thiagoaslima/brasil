import { EscopoIndicadores } from '../configuration/servidor.configuration';
import { PesquisaService } from '../pesquisa.service';
import { Pesquisa } from '../models/pesquisa.model';
import { Indicador } from '../models/indicador.model';
import { RetrieveStrategy } from './strategy.interface';

import { Observable } from 'rxjs/Observable';

export class IndicadoresFilhosStrategy implements RetrieveStrategy<Observable<Indicador[]>> {
    constructor(
        private _service: PesquisaService
    ) { }

    retrieve(pesquisaId: number, posicaoIndicador: string, codigoLocalidade: number) {
        return this._service.getIndicadoresFilhos(pesquisaId, posicaoIndicador, codigoLocalidade);
    }
}

export class IndicadoresComResultadosStrategy implements RetrieveStrategy<Observable<Indicador[]>> {
    constructor(
        private _service: PesquisaService
    ) { }

    retrieve(pesquisaId: number, posicaoIndicador: string, codigoLocalidade: number, escopo: EscopoIndicadores) {
        return this._service.getIndicadoresComResultados(pesquisaId, posicaoIndicador, codigoLocalidade, escopo);
    }
}

export class IndicadorPaiStrategy implements RetrieveStrategy<Observable<Indicador>> {
    constructor(
        private _service: PesquisaService
    ) { }

    retrieve(pesquisaId: number, posicaoIndicador: string, codigoLocalidade: number) {
        return this._service.getIndicadorByPosicao(pesquisaId, posicaoIndicador, codigoLocalidade);
    }
}