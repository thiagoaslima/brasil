var http = require('http');
var { Router } = require('express');

import { fakeDemoRedisCache as cache } from './cache';

const URL = {
    _prefix: 'http://servicodados.ibge.gov.br/api/v1',

    set: function (url) {
        return this._prefix + url;
    }
};

const getContent = function (url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
        if (cache.get(url)) {
            resolve(cache.get(url));
        }

        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => {
                let response = body.join('');
                cache.set(url, response);
                resolve(response);
            });
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err))
    });
};



export function mockServices() {

    var router = Router();

    let pesquisas = getContent(URL.set('/pesquisas'))
        .then(JSON.parse)
        .then(pesquisas => {
            pesquisas.forEach(pesquisa => pesquisa.indicadores = []);
            return pesquisas;
        });

    let hashPesquisas = pesquisas.then(pesquisas => {
        return pesquisas.reduce((agg, pesquisa) => {
            agg[pesquisa.id] = pesquisa;
            return agg;
        }, {})
    });

    let indicadores: Promise<Array<{}[]>> = pesquisas.then(pesquisas => {
        let promises = pesquisas.map(pesquisa => {
            let url = URL.set(`/pesquisas/${pesquisa.id}/periodos/all/indicadores`);

            return getContent(url)
                .catch(err => JSON.stringify([]))
                .then(JSON.parse)
                .then(indicadores => {
                    indicadores.forEach(indicador => _registerPesquisa(indicador, pesquisa));
                    return indicadores;
                });
        });

        return Promise.all(promises)
    });

    let hashIndicadores = indicadores.then((indicadores) => {
        let _indicadores = indicadores.reduce((agg, indicadores) => {
            return agg.concat(indicadores)
        }, []);
        return _indicadores.reduce(_generateHashIndicador, {});
    });

    Promise.all([pesquisas, indicadores]).then(([pesquisas, indicadores]) => {
        pesquisas.forEach(pesquisa => {
            Object.keys(pesquisa).forEach(key => {
                if (Array.isArray(pesquisa[key])) {
                    Object.freeze(pesquisa[key]);
                }
            });
            Object.freeze(pesquisa);
        })
    });

    router.route('/teste')
        .get(function (req, res) {
            var unidades = {
                maior: {
                    indicadores: [],
                    value: [],
                    size: Number.MIN_SAFE_INTEGER
                },
                menor: {
                    indicadores: [],
                    value: [],
                    size: Number.MAX_SAFE_INTEGER
                },
                busca: {
                    indicadores: [],
                    value: [],
                    size: Number.MAX_SAFE_INTEGER
                },
                limite: Number.MAX_SAFE_INTEGER
            };
            let {size, limit} = req.query;

            unidades.limite = limit ? parseInt(limit, 10) : Number.MAX_SAFE_INTEGER;
            unidades.busca.size = size ? parseInt(size, 10) : -1;

            function _resumeIndicador(indicador) {
                indicador = Object.assign({}, indicador);

                if (!indicador.unidade) {
                    indicador.unidade = { id: '' };
                }

                if (indicador.children && indicador.children.length) {
                    indicador.children = indicador.children.map(_resumeIndicador);
                }
                return ['id', 'indicador', 'unidade', 'classe', 'children', 'pesquisa'].reduce((obj, key) => {
                    obj[key] = indicador[key];
                    return obj;
                }, {});
            }

            function _checkUnidade(indicador, unidade?) {
                if (!unidade) {
                    unidade = indicador.unidade.id;
                }

                if (unidade.length > 0) {
                    if (unidades.maior.size < unidade.length && unidade.length <= unidades.limite) {
                        unidades.maior = {
                            indicadores: [`${indicador.pesquisa}:${indicador.id}`],
                            value: [unidade],
                            size: unidade.length
                        }
                    }
                    if (unidades.maior.size === unidade.length) {
                        if (unidades.maior.value.indexOf(unidade) === -1) {
                            unidades.maior.value.push(unidade);
                            unidades.maior.indicadores.push(`${indicador.pesquisa}:${indicador.id}`);
                        }
                    }

                    if (unidades.menor.size > unidade.length) {
                        unidades.menor = {
                            indicadores: [`${indicador.pesquisa}:${indicador.id}`],
                            value: [unidade],
                            size: unidade.length
                        }
                    }
                    if (unidades.menor.size === unidade.length) {
                        if (unidades.menor.value.indexOf(unidade) === -1) {
                            unidades.menor.value.push(unidade);
                            unidades.menor.indicadores.push(`${indicador.pesquisa}:${indicador.id}`);
                        }
                    }

                    if (unidades.busca.size === unidade.length) {
                        if (unidades.busca.value.indexOf(unidade) === -1) {
                            unidades.busca.value.push(unidade);
                            unidades.busca.indicadores.push(`${indicador.pesquisa}:${indicador.id}`);
                        }
                    }
                }

                let comp = indicador.unidade.id === unidade || indicador.unidade.id === '';
                let childComp = true;

                if (indicador.children && indicador.children.length) {
                    childComp = indicador.children.reduce((agg, child) => {
                        return agg && _checkUnidade(child, unidade);
                    }, true);
                }

                return comp && childComp;
            }

            indicadores.then(indicadoresArr => {
                return indicadoresArr
                    .map(indicadoresPesquisa => {
                        return indicadoresPesquisa
                            .map(_resumeIndicador)
                            .map(indicador => {
                                return {
                                    indicador,
                                    mesmaUnidade: _checkUnidade(indicador)
                                }
                            });
                    })
            }).then(indicadores => {
                return res.json(unidades);
            })
        });


    router.route('/pesquisa/:id/completa')
        .get(function (req, res) {

            let {id} = req.params;
            let {localidade, localidades, periodo, periodos} = req.query;
            if (localidade && !localidades) localidades = localidade;
            if (periodo && !periodos) periodos = periodo;
            let pesquisa = hashPesquisas.then(hash => hash[id]);

            let _indicadores = Promise.all([pesquisa, indicadores])
                .then(([pesquisa, indicadores]) => {
                    return indicadores.filter(indicadores => indicadores.length && indicadores[0]['pesquisa'] === pesquisa.id)[0];
                });

            _indicadores.then(indicadores => {
                let body = indicadores.map(indicador => {
                    return _getResults(indicador, localidades)
                });
                return Promise.all(body).then(res.json);
            })

        });

    router.route('/indicador/:id')
        .get(function (req, res) {
            let {localidade, localidades, periodo, periodos} = req.query;
            if (localidade && !localidades) localidades = localidade;
            if (periodo && !periodos) periodos = periodo;

            let {id} = req.params;
            let _indicador = hashIndicadores.then(hash => hash[id]);

            if (!localidades && !periodos) {
                return Promise.all([_indicador, hashPesquisas]).then(([indicador, pesquisas]) => {
                    res.json([{
                        indicador: indicador,
                        pesquisa: pesquisas[indicador.pesquisa]
                    }])
                });
            } else {
                _indicador.then(indicador => {
                    let url = URL.set(`/pesquisas/${indicador.pesquisa}/periodos/all/resultados?localidade=${localidades}&indicadores=${indicador.id}`)
                    return Promise.all([indicador, getContent(url).then(JSON.parse)]);
                }).then(([indicador, resultados]) => {
                    if (periodos) {
                        periodos = periodos.split(',');
                        resultados = _filtrarPeriodosResultados(resultados[0], periodos);
                    }

                    return hashPesquisas.then(pesquisas => {
                        let ind = Object.assign(
                            {},
                            indicador,
                            { res: resultados }
                        );
                        res.json([{
                            indicador: ind,
                            pesquisa: pesquisas[indicador.pesquisa]
                        }]);
                    })
                });
            }

        });

    return router;
}

const _getResults = function (indicador, localidades) {
    let url = URL.set(`/pesquisas/${indicador.pesquisa}/periodos/all/resultados?localidades=${localidades}&indicadores=${indicador.id}`);

    let _resultados = getContent(url).then(JSON.parse);

    let _childrenPromises = indicador.children.length
        ? indicador.children.map(child => _getResults(child, localidades))
        : Promise.resolve([]);

    let _indicador = Promise.all([_childrenPromises, _resultados])
        .then(([children, resultados]) => {
            return Object.assign(
                {},
                indicador,
                { children },
                { res: resultados }
            );
        });

    return _indicador;
}

const _filtrarPeriodosResultados = (resultados, periodos) => {
    resultados.res = resultados.res.map(obj => {
        obj.res = periodos.reduce((agg, periodo) => {
            if (obj.res[periodo]) {
                agg[periodo] = obj.res[periodo];
            };
            return agg;
        }, {});

        return Object.keys(obj.res).length ? obj : false;
    });

    resultados.res = resultados.res.filter(obj => !!obj.res);
    return resultados;
}

const _registerPesquisa = function registerPesquisa(indicador, pesquisa) {
    indicador.pesquisa = pesquisa.id;
    indicador.pesquisaObj = pesquisa;
    pesquisa.indicadores.push(indicador.id);
    if (indicador.children.length) {
        indicador.children.forEach(child => registerPesquisa(child, pesquisa));
    }
    Object.keys(indicador).forEach(key => {
        if (Array.isArray(indicador[key])) {
            Object.freeze(indicador[key]);
        }
    });
    Object.freeze(indicador);
}

const _generateHashIndicador = function generateHashIndicador(hash, indicador) {
    if (hash[indicador.id]) {
        throw new Error('Indicador com id repetida');
    }
    hash[indicador.id] = indicador;

    if (indicador.children.length) {
        indicador.children.forEach(child => generateHashIndicador(hash, child));
    }
    return hash;
}