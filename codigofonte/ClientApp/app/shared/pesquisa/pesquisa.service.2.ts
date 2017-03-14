import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Periodo, Pesquisa, Indicador, ResultadosIndicador, ResultadosServer } from './pesquisa.interface.2';
import { PesquisaCacheStrategy, IndicadorCacheStrategy, IndicadoresCacheStrategy, ResultadosCacheStrategy, ResultadosHttpStrategy } from './pesquisa-strategies';
import { slugify } from '../../utils/slug';
import { flatTree } from '../../utils/flatFunctions';
import { BASES, PESQUISAS } from '../../global-config';

import { SystemCacheService } from '../system-cache.service';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/zip';

@Injectable()
export class PesquisaService {

    private _server = {
        path: this._bases.default.base
    }

    private _subjects = {};

    constructor(
        private _cache: SystemCacheService,
        private _pesquisas: PESQUISAS,
        private _bases: BASES,
        private _http: Http
    ) {
        Pesquisa.setStrategy(new IndicadoresCacheStrategy(_cache));

        Indicador.setPesquisaStrategy(new PesquisaCacheStrategy(_cache));

        Indicador.setIndicadoresStrategy(
            new IndicadorCacheStrategy(_cache),
            new IndicadoresCacheStrategy(_cache)
        );

        let cacheStrategy = new ResultadosCacheStrategy(_cache);
        let httpStrategy = new ResultadosHttpStrategy(this);
        Indicador.setResultadosStrategy({
            retrieve: function (indicador: Indicador, codigosLocalidade: number | number[]) {
                let resultados = cacheStrategy.retrieve(indicador, codigosLocalidade);

                if (resultados) {
                    return Observable.of(resultados);
                }

                if (!codigosLocalidade) {
                    return null;
                }

                return httpStrategy.retrieve(indicador, codigosLocalidade);
            }
        });
    }


    getAllPesquisas(): Observable<Pesquisa[]> {
        let listaPesquisas = this._cache.buildKey.allPesquisas();

        if (this._cache.has(listaPesquisas)) {
            let ids = this._cache.get(listaPesquisas);
            return Observable.of(ids.map(id => this._cache.getPesquisa(id)));
        }

        if (this._subjects[listaPesquisas]) {
            return this._subjects[listaPesquisas];
        }

        let _subject = new ReplaySubject(1);
        this._subjects[listaPesquisas] = _subject.asObservable().share();

        this._http.get(this._server.path('pesquisas'))
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(json => { return json.filter(pesquisa => this._pesquisas.isValida(pesquisa.id)) })
            .map(json => json.map(pesquisa => new Pesquisa(pesquisa)))
            .subscribe(pesquisas => {
                this._cache.set(listaPesquisas, pesquisas.map(pesquisa => pesquisa.id));
                this._cache.savePesquisas(pesquisas);
                _subject.next(pesquisas);
                this._subjects[listaPesquisas] = null;
                _subject.complete();
                _subject = null;
            })

        return this._subjects[listaPesquisas];
    }

    getPesquisa(pesquisaId: number): Observable<Pesquisa> {
        let pesquisa = this._cache.getPesquisa(pesquisaId);

        if (pesquisa) {
            return Observable.of(pesquisa);
        }

        return this.getAllPesquisas()
            .map(pesquisas => pesquisas.filter(pesquisa => pesquisa.id === pesquisaId)[0]);
    }

    getIndicadoresDaPesquisa(pesquisaId: number): Observable<Indicador[]> {

        let pesquisa = this._cache.getPesquisa(pesquisaId);

        if (pesquisa) {
            return Observable.of(pesquisa.indicadores);
        }

        let key = this._cache.buildKey.listaIndicadoresDaPesquisa(pesquisaId);
        if (this._subjects[key]) {
            return this._subjects[key];
        }

        let _subject = new ReplaySubject(1);
        this._subjects[key] = _subject.asObservable().share();

        this._http.get(this._server.path(`pesquisas/${pesquisaId}/periodos/all/indicadores`))
            .retry(3)
            .catch(err => {
                return Observable.of({ json: () => [] });
            })
            .map(res => res.json())
            .zip(this.getPesquisa(pesquisaId), (json, pesquisa) => {
                return json.map(indicador => this._createIndicadorAndSaveOnCache(indicador, pesquisa));
            })
            .subscribe(indicadores => {
                _subject.next(indicadores);
                this._subjects[key] = null;
                _subject.complete();
                _subject = null;
            });

        return this._subjects[key];
    }

    getIndicadores(pesquisaId: number, indicadoresId?: number | number[]): Observable<Indicador[]> {
        if (!indicadoresId) {
            return this.getIndicadoresDaPesquisa(pesquisaId);
        }

        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];

        // como o cache de indicadores é feito a partir da lista de indicadores por pesquisa
        // se 1 indicador estiver no cache, todos estarão!
        // let hashCacheKey = this._cache.buildKey.hashIndicadoresDaPesquisa(pesquisaId);
        let indicadores = _indicadoresId.map(id => this._cache.getIndicador(pesquisaId, id)).filter(v => !!v);
        if (indicadores.length === _indicadoresId.length) {
            return Observable.of(indicadores);
        }

        return this.getIndicadoresDaPesquisa(pesquisaId)
            .map(_ => this._cache.getIndicadores(pesquisaId, _indicadoresId));
    }

    getFilhosIndicador(pesquisaId, indicadorId = 0, tree?: boolean) {
        const scope = tree ? 'one' : 'sub';

        if (indicadorId === 0) {
            const urlFilhos = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/0?scope=${scope}`;
            return this._http.get(urlFilhos)
                .retry(3)
                .catch(err => Observable.of({ json: () => [] }))
                .map(res => res.json());
        }

        const urlFilhos = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/0?scope=one`;
        let indicador$ = this._http.get(urlFilhos)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map(indicadores => indicadores.find(indicador => indicador.id === indicadorId));


        return indicador$.flatMap(indicador => {
                indicador = indicador || {}; 
                const url = `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${indicador.posicao}?scope=${scope}`;
                return this._http.get(url)
                    .retry(3)
                    .catch(err => Observable.of({ json: () => [] }))
            })


    }

    getResultados(pesquisaId: number, indicadoresId: number | number[], localidadesCodigo: number | number[]): Observable<ResultadosIndicador[]> {
        let _localidadesCodigoArray = Array.isArray(localidadesCodigo) ? localidadesCodigo : [localidadesCodigo];
        let _indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];
        let queryIndicadores = _indicadoresId.length ? `&indicadores=${_indicadoresId.join(',')}` : '';
        let url = this._server.path(`pesquisas/${pesquisaId}/periodos/all/resultados?localidade=${_localidadesCodigoArray.join(',')}${queryIndicadores}`);

        let _resultados = _indicadoresId.map(id => this._cache.getResultados(id)).filter(resultado => !!resultado && _localidadesCodigoArray.every(codigo => resultado.resultados[codigo] !== undefined));
        if (_resultados.length === _indicadoresId.length) {
            return Observable.of(_resultados);
        }

        return this._http.get(url)
            .retry(3)
            .catch(err => Observable.of({ json: () => [] }))
            .map(res => res.json())
            .map((resultados: ResultadosServer[]) => {
                return resultados.map(resultado => {
                    let resultadoObj = resultado.res.reduce((map, res) => {
                        return Object.assign(map, { [parseInt(res.localidade, 10)]: res.res })
                    }, Object.create(null));

                    return <ResultadosIndicador>{
                        id: resultado.id,
                        resultados: resultadoObj
                    };
                });
            })
            .do(resultados => {
                resultados.forEach(resultado => {
                    this._cache.saveResultados(resultado.id, resultado);
                });
            });

    }

    private _createIndicadorAndSaveOnCache(protoIndicador, pesquisa: Pesquisa, parentId = 0) {
        let children = [];

        if (protoIndicador.children.length) {
            children = protoIndicador.children.map(child => this._createIndicadorAndSaveOnCache(child, pesquisa, protoIndicador.id));
        }

        let indicador = new Indicador(Object.assign(
            {},
            protoIndicador,
            {
                children,
                pesquisa: pesquisa,
                parent: parentId
            }
        ));

        if (parentId === 0) {
            pesquisa.registerIndicadores([indicador.id]);
        }

        this._cache.saveIndicador(pesquisa.id, indicador);

        return indicador;
    }

}

