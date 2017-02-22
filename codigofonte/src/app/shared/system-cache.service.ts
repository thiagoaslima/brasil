import { Inject, Injectable, isDevMode } from '@angular/core';
import { CacheService } from './cache.service';
import { Pesquisa, Indicador, ResultadosIndicador } from './pesquisa/pesquisa.interface.2';

import { flatTree } from '../utils/flatFunctions';

const keys = [
    {
        path: "busca",
        key: "",
        children: [
            {
                path: "any",
                key: "busca",
                children: []
            }
        ]
    },

    {
        path: "hashPesquisas",
        key: "hashPesquisas"
    },

    {
        path: "pesquisas",
        key: "allPesquisas",
        children: [
            {
                path: "any",
                key: "pesquisa",
                children: [
                    {
                        path: "indicadores",
                        key: "listaIndicadoresDaPesquisa"
                    },
                    {
                        path: "hash",
                        key: "hashIndicadoresDaPesquisa"
                    },
                    {
                        path: "resultados",
                        key: "resultadosPesquisa"
                    },
                    {
                        path: "localidades",
                        children: [
                            {
                                path: "any",
                                children: [
                                    {
                                        path: "resultados",
                                        key: "resultadosPesquisaLocalidade"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },

    {
        path: "indicadores",
        children: [
            {
                path: "any",
                key: "indicador",
                children: [
                    {
                        path: "resultados",
                        key: "resultados"
                    }
                ]
            }
        ]
    }
]

@Injectable()
export class SystemCacheService {
    static KEY = 'SystemCacheService';

    constructor(
        @Inject('LRU') public _cache: Map<string, any>
    ) { }

    buildKey = {
        allPesquisas: () => "pesquisas",
        // hashPesquisas: () => "hashPesquisas",
        pesquisa: (pesquisaId: number) => `pesquisas/${pesquisaId}`,
        listaIndicadoresDaPesquisa: (pesquisaId: number | string) => `pesquisas/${pesquisaId}/indicadores`,
        hashIndicadoresDaPesquisa: (pesquisaId: number | string) => `pesquisas/${pesquisaId}/hash`,
        indicador: (pesquisaId: number, indicadorId: number) => `indicadores/${indicadorId}`,
        resultados: (indicadorId: number) => `indicadores/${indicadorId}/resultados`,
        resultadosPesquisaLocalidade: (pesquisaId: number | string, localidadeCodigo: number | string) => `pesquisas/${pesquisaId}/localidades/${localidadeCodigo}/resultados`,
        //resultadosPesquisa: (pesquisaId: number, localidadeCodigo: number) => `pesquisas/${pesquisaId}/resultados`,
        busca: (termo: string) => `busca/${termo}`
    }

    checkKey(str) {
        const arr = str.split('?')[0].split('/');
        const len = arr.length;

        const obj = arr.reduce((agg, str, idx) => {
            let _obj = agg.reduce((obj, item) => item.path === str ? item : obj, null);
            if (!_obj) {
                _obj = agg.reduce((obj, item) => item.path === "any" ? item : obj, null);
            }
            return idx === len - 1 ? _obj : _obj.children;
        }, keys);

        return obj.key;
    }

    savePesquisas(pesquisas: Pesquisa[]) {
        pesquisas.forEach(pesquisa => this._cache.set(
            this.buildKey.pesquisa(pesquisa.id), pesquisa)
        );
    }

    getPesquisa(id: number): Pesquisa {
        return this._cache.get(this.buildKey.pesquisa(id));
    }

    saveIndicador(pesquisaId: number, indicador: Indicador) {
        this._cache.set(
            this.buildKey.indicador(pesquisaId, indicador.id),
            indicador
        );
    }

    getIndicador(pesquisaId: number, id: number): Indicador {
        return this._cache.get(this.buildKey.indicador(pesquisaId, id));
    }

    getIndicadores(pesquisaId: number, ids: number[]): Indicador[] {
        return ids.map(id => this.getIndicador(pesquisaId, id));
    }


    saveResultados(indicadorId: number, resultados: ResultadosIndicador) {
        let resultado = this.getResultados(indicadorId);
        
        if (resultado) {
            Object.assign(resultado, resultados);
        } else {
            this._cache.set(
                this.buildKey.resultados(indicadorId),
                resultados
            );
        }
    }

    getResultados(indicadorId: number): ResultadosIndicador {
        return this._cache.get(this.buildKey.resultados(indicadorId));
    }

    /**
     * check if there is a value in our store
     */
    has(key: string | number): boolean {
        let _key = this.normalizeKey(key);
        return this._cache.has(_key);
    }

    /**
     * store our state
     */
    set(key: string | number, value: any): void {
        let _key = this.normalizeKey(key);
        this._cache.set(_key, { value, _requested: 0 });
    }

    /**
     * get our cached value
     */
    get(key: string | number): any {
        let _key = this.normalizeKey(key);
        let value = this._cache.get(_key);
        if (value) {
            value._requested += 1;
            return value;
        }
        return null;
    }

    /**
     * release memory refs
     */
    clear(): void {
        this._cache.clear();
    }

    /**
     * convert to json for the client
     */
    dehydrate(): any {
        let json = {};
        this._cache.forEach((value: any, key: string) => json[key] = value);
        return json;
    }

    /**
     * convert server json into out initial state
     */
    _rehydrate(json: any): void {
        Object.keys(json).forEach((key: string) => {
            let _key = this.normalizeKey(key);
            let value = json[_key];
            this._cache.set(_key, value);
        });
    }
    rehydrate(json: any): void {
        Object.keys(json).forEach((key: string) => {
            let _key = this.normalizeKey(key);
            let value = json[_key];

            switch (this.checkKey(key)) {
                case "pesquisas":
                    this._cache.set(_key, value);
                    break;

                case "pesquisa":
                    this.savePesquisas([new Pesquisa(value)]);
                    break;

                case "indicador":
                    let indicador = new Indicador(
                        Object.assign(
                            {},
                            value,
                            {
                                children: value._children,
                                pesquisa: value.pesquisaId,
                                parent: value._parentId
                            })
                    );
                    this.saveIndicador(value.pesquisaId, indicador);
                    break;

                default:
                    value = json[_key];
                    this._cache.set(_key, value);
                    break;
            }
        });
    }

    /**
     * allow JSON.stringify to work
     */
    toJSON(): any {
        return this.dehydrate();
    }

    /**
     * convert numbers into strings
     */
    normalizeKey(key: string | number): string {
        if (isDevMode() && this._isInvalidValue(key)) {
            throw new Error('Please provide a valid key to save in the CacheService');
        }

        return key + '';
    }

    _isInvalidValue(key): boolean {
        return key === null ||
            key === undefined ||
            key === 0 ||
            key === '' ||
            typeof key === 'boolean' ||
            Number.isNaN(<number>key);
    }
}

/*
export const SystemCache = {

    _buildKey: {
        allPesquisas: () => "pesquisas",
        pesquisa: (pesquisaId: number) => `pesquisas/${pesquisaId}`,
        listaIndicadoresDaPesquisa: (pesquisaId: number) => `pesquisas/${pesquisaId}/indicadores`,
        indicador: (pesquisaId: number, indicadorId: number) => `indicadores/${indicadorId}`,
        resultadosIndicador: (pesquisaId: number, localidadeId: number, indicadorId: number) => `indicadores/${indicadorId}/resultados?localidades=${localidadeId}`,
        resultadosPesquisa: (pesquisaId: number, localidadeId: number) => `pesquisas/${pesquisaId}/resultados`,
        busca: (termo: string) => `busca/${termo}`
    },

    _checkKey(str) {
        const arr = str.split('?')[0].split('/');
        const len = arr.length;

        const obj = arr.reduce((agg, str, idx) => {
            let _obj = agg.filter(item => item.path === str);

            if (_obj.length === 0) {
                _obj = agg.filter(item => item.path === "any");
            }

            return idx === len - 1 ? _obj : _obj.children;
        }, keys);

        return obj.key;
    },

    rehydrate(json: any): void {
        Object.keys(json).forEach((key: string) => {
            let _key = this.normalizeKey(key);
            let value;

            switch (SystemCache._checkKey(key)) {
                case "pesquisas":
                    value = json[_key].map(value => {
                        const pesquisa = new Pesquisa(value);
                        this._cache.set(SystemCache._buildKey.pesquisa(pesquisa.id), pesquisa);
                    });
                    this._cache.set(_key, value);
                    break;

                case "pesquisa":
                    break;

                case "listaIndicadores":
                    break;

                case "indicador":
                    this._cache.set(_key, new Indicador(json[_key]));
                    break;

                default:
                    value = json[_key];
                    this._cache.set(_key, value);
                    break;
            }
        });
    }
}
*/

/*
@Injectable()
export class SystemCacheService {
    static KEY = "SystemCache";

    constructor( @Inject('LRU') _cache: Map<string, any>) {
        let instance = new Proxy(new CacheService(_cache), {
            get(target, propKey) {
                return SystemCache[propKey] || target[propKey];
            }
        });

        Object.assign(instance, { _buildKey: SystemCache._buildKey });

        return instance;
    }

};
*/