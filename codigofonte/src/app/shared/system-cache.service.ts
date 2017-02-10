import { Inject, Injectable, isDevMode } from '@angular/core';
import { CacheService } from './cache.service';
import { Pesquisa, Indicador } from './pesquisa/pesquisa.interface';


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
                        path: "resultados",
                        key: "resultadosPesquisa"
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
                        key: "resultadosIndicador"
                    }
                ]
            }
        ]
    }
]

@Injectable()
export class SystemCacheService {
    static KEY = 'SystemCacheService';

    buildKey = {
        allPesquisas: () => "pesquisas",
        // pesquisa: (pesquisaId: number) => `pesquisas/${pesquisaId}`,
        listaIndicadoresDaPesquisa: (pesquisaId: number) => `pesquisas/${pesquisaId}/indicadores`,
        indicador: (pesquisaId: number, indicadorId: number) => `indicadores/${indicadorId}`,
        resultadosIndicador: (pesquisaId: number, localidadeId: number, indicadorId: number) => `indicadores/${indicadorId}/resultados?localidades=${localidadeId}`,
        resultadosPesquisa: (pesquisaId: number, localidadeId: number) => `pesquisas/${pesquisaId}/resultados`,
        busca: (termo: string) => `busca/${termo}`
    }

    checkKey(str) {
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
    }

    constructor( @Inject('LRU') public _cache: Map<string, any>) {

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
        this._cache.set(_key, value);
    }

    /**
     * get our cached value
     */
    get(key: string | number): any {
        let _key = this.normalizeKey(key);
        return this._cache.get(_key);
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
            let value;

            switch (this.checkKey(key)) {
                case "pesquisas":
                    value = json[_key].map(value => {
                        const pesquisa = new Pesquisa(value);
                        this._cache.set(this.buildKey.pesquisa(pesquisa.id), pesquisa);
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