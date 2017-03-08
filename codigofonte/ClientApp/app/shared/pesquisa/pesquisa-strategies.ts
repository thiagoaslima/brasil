import { SystemCacheService } from '../system-cache.service';
import { PesquisaService } from './pesquisa.service.2';
import { Pesquisa, Indicador, ResultadosIndicador } from './pesquisa.interface.2';

export interface RetrieveStrategy<T> {
    retrieve(id: any, contextId?: any): T
}


export class PesquisaCacheStrategy implements RetrieveStrategy<Pesquisa>{
    constructor(
        private _cache: SystemCacheService
    ) { }

    retrieve(id: number): Pesquisa {
        return this._cache.getPesquisa(id);
    }
}

export class IndicadorCacheStrategy implements RetrieveStrategy<Indicador> {
    constructor(
        private _cache: SystemCacheService
    ) { }

    retrieve(id: number, pesquisaId): Indicador {
        return this._cache.getIndicador(pesquisaId, id);
    }
}

export class IndicadoresCacheStrategy implements RetrieveStrategy<Indicador[]> {
    constructor(
        private _cache: SystemCacheService
    ) { }

    retrieve(ids: number[], pesquisaId: number): Indicador[] {
        return this._cache.getIndicadores(pesquisaId, ids);
    }
}

export class ResultadosCacheStrategy implements RetrieveStrategy<any> {
    constructor(
        private _cache: SystemCacheService
    ) { }

    retrieve(indicador: Indicador, codigoLocalidades: number | number[] = []) {
        let resultados = this._cache.getResultados(indicador.id);
        let _codigos = Array.isArray(codigoLocalidades) ? codigoLocalidades : [codigoLocalidades];

        if (!resultados) {
            return null;
        }

        if (_codigos.length === 0) {
            return resultados;
        }

        return resultados;
    }
}

export class ResultadosHttpStrategy implements RetrieveStrategy<any> {
    constructor(
        private _service: PesquisaService
    ) { }

    retrieve(indicador: Indicador, codigosLocalidade: number | number[]) {
        return this._service.getResultados(
            indicador.pesquisaId,
            indicador.id,
            codigosLocalidade
        ).map(resultados => resultados.length ? resultados[0] : <ResultadosIndicador>{ id: indicador.id, resultados: {} });

    }
}