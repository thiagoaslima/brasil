import { Inject, Injectable, isDevMode } from '@angular/core';
import { CacheService } from '../cache.service';
import { Pesquisa, Indicador } from './pesquisa.interface';

const _tree = {
    children: {
        "busca": {
            children: {
                "any": {
                    value: "busca"
                }
            }
        },

        "pesquisas": {
            value: "allPesquisas",
            children: {
                "any": {
                    value: "pesquisa",
                    children: {
                        "indicadores": {
                            value: "listaIndicadores",
                            children: {
                                "any": {
                                    value: "indicador",
                                    children: {
                                        "resultados": {
                                            value: "resultadosPesquisa"
                                        }
                                    }
                                }
                            }
                        },
                        "resultados": {
                            value: "resultadosPesquisa"
                        }
                    }
                }
            }
        }
    }

}

class SystemCache {

    static _buildKey = {
        allPesquisas: () => "pesquisas",
        pesquisa: (pesquisaId: number) => `pesquisas/${pesquisaId}`,
        listaIndicadores: (pesquisaId: number) => `pesquisas/${pesquisaId}/indicadores`,
        indicador: (pesquisaId: number, indicadorId: number) => `pesquisas/${pesquisaId}/indicadores/${indicadorId}`,
        resultados: (pesquisaId: number, localidadeId: number, indicadorId: number) => `pesquisas/${pesquisaId}/indicadores/${indicadorId}/resultados?localidades=${localidadeId}`,
        resultadosPesquisa: (pesquisaId: number, localidadeId: number) => `pesquisas/${pesquisaId}/resultados`,
        busca: (termo: string) => `busca/${termo}`
    }

    static _checkKey(str) {
        const arr = str.split('?')[0].split('/');

        if (arr[0] === 'busca') {
            return "busca"
        }

        if (arr.length == 1) {
            return "allPesquisas";
        } 

        if (arr.length == 2) {
            return "pesquisa";
        }

        if (arr.length === 3) {
            switch(arr[2]) {
                case "indicadores":
                    return "listaIndicadores";
                
                case "resultados":
                    return 
            }
        }

        const obj = arr.reduce((agg, str) => {
            return agg.children[str] || agg.children['any'];
        }, _tree);

        return obj.value;
    }
}

const getHandlers = {
    _cacheKeys: {
        "allPesquisas": () => "pesquisas",
        "pesquisa": (pesquisaId: number) => `pesquisas/${pesquisaId}`,
        "listaIndicadores": (pesquisaId: number) => `pesquisas/${pesquisaId}/indicadores`,
        "indicador": (pesquisaId: number, indicadorId: number) => `pesquisas/${pesquisaId}/indicadores/${indicadorId}`,
        "resultados": (pesquisaId: number, localidadeId: number, indicadorId: number) => `pesquisas/${pesquisaId}/indicadores/${indicadorId}/resultados?localidades=${localidadeId}`,
        "resultadosPesquisa": (pesquisaId: number, localidadeId: number) => `pesquisas/${pesquisaId}/resultados`,
        "busca": (termo: string) => `busca/${termo}`
    },

    _checkKeys: function (str) {
        let arr = str.split('?')[0].split('/');

        

        let obj = arr.reduce((agg, str) => {
            return agg.children[str] || agg.children['any'];
        }, _tree);

        return obj.value;
    },

    rehydrate: function _rehydrate(json: any): void {
        Object.keys(json).forEach((key: string) => {
            let _key = this.normalizeKey(key);
            let value;

            switch (getHandlers._checkKeys(key)) {
                case "pesquisas":
                    value = json[_key].map(value => {
                        const pesquisa = new Pesquisa(value);
                        this._cache.set(getHandlers._cacheKeys.pesquisa(pesquisa.id), pesquisa);
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

@Injectable()
export class PesquisaCacheService {

    constructor( @Inject('LRU') public _cache: Map<string, any>) {
        return new Proxy(new CacheService(_cache), {
            get(target, propKey) {
                return getHandlers[propKey] || target[propKey];
            }
        });
    }

};