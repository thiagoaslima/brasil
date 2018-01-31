import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Ranking, RankingLocalidade, ItemRanking } from '.';
import { niveisTerritoriais } from '../values';
import { ConfigService } from '../../';
import { LocalidadeService3 } from '../localidade/localidade.service';

const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });
@Injectable()
export class RankingService3 {

    constructor(
        private _http: Http,
        private configService: ConfigService,
        private localidadeService: LocalidadeService3
    ) { }

    public getRankingsIndicador(indicadores: Array<{ indicadorId: number, periodo: string }>, contextos: string[], codigoLocalidade: number) {

        const _contexto = contextos.join(',');
        const _indicadores = indicadores.map(obj => `${obj.indicadorId}(${obj.periodo})`).join('|');
        const tipo = this._getTipoLocalidade(codigoLocalidade);
        const naturezaParams = tipo === 'uf' ? 3 : 4;

        const url = `${this.configService.getConfigurationValue('ENDPOINT_SERVICO_DADOS')}/v1/pesquisas/indicadores/ranking/${_indicadores}?localidade=${codigoLocalidade}&contexto=${_contexto}&upper=0&lower=0&natureza=${naturezaParams}`;

        return this._request(url).map(response => response.map(item => new Ranking(item)));
    }

    private _obterLocalidade(id: number){

        // Se o código for de uma UF
        if(String(id).length == 2){

            return this.localidadeService.getUfByCodigo(id);
        }

        return this.localidadeService.getMunicipioByCodigo(id);
    }


    public getRankingIndicador(indicadorId: number, periodo: string, contexto: string[], localidade: number, natureza: number = 4){

        const _contexto = contexto.join(',');

        const url = `${this.configService.getConfigurationValue('ENDPOINT_SERVICO_DADOS')}/v1/pesquisas/indicadores/ranking/${indicadorId}(${periodo})?localidade=${localidade}&contexto=${_contexto}&natureza=${natureza}&appCidades=1`;

        return this._request(url)
            .map(rankings => {

                return rankings.map(rankings => {

                    let grupo: ItemRanking[] = [];

                    rankings.res.map(ranking => {

                        let item = new ItemRanking(
                            this._obterLocalidade(parseInt(ranking['localidade'], 10)),
                            ranking['#'],
                            ranking['res']);

                        if(!!rankings.unidade){
                            item.fatorMultiplicativo = rankings.unidade.multiplicador;
                            item.unidadeMedida = rankings.unidade.id;
                        }

                        grupo.push(item);
                    });

                    return grupo;
                });

            })
            .map(res => {

                let listaRankingLocalidade: RankingLocalidade[] = [];
                for(let i = 0; i < contexto.length; i++){

                    let rankingLocalidade: RankingLocalidade = new RankingLocalidade(indicadorId, periodo, contexto[i], localidade, res[i]);

                    listaRankingLocalidade.push(rankingLocalidade);
                }

                return listaRankingLocalidade;
            });
    }

    private _getTipoLocalidade(codigoLocalidade: number): string {
        const len = codigoLocalidade.toString().length;
        let tipo: string;

        switch (len) {
            case 1:
                tipo = codigoLocalidade === 0
                    ? niveisTerritoriais.pais.label
                    : niveisTerritoriais.macrorregiao.label;
                break;

            case 2:
                tipo = niveisTerritoriais.uf.label;
                break;

            case 4:
                tipo = niveisTerritoriais.ufSub.label;
                break;

            case 6:
                tipo = niveisTerritoriais.municipio.label;
                break;

            case 8:
                tipo = niveisTerritoriais.municipioSub.label;
                break;
        }

        return tipo;
    }

    private _request(url: string) {
        return this._http.get(url, options)
            .retry(3)
            .map(res => {
                if (res.status === 404) {
                    throw new Error(`Não foi encontrado o endereço solicitado. [url: ${url}]`);
                }

                if (res.status === 400 || res.status === 500) {
                    throw new Error();
                }

                const obj = res.json();
                if (this._isServerError(obj)) {
                    throw new Error();
                }

                return obj;
            })
            .share();
    }

    private _handleError(error: Error, customError?: Error): Observable<any> {
        return Observable.throw(error.message ? error : customError);
    }

    private _isServerError(res) {
        return res && typeof res === 'object' && !Array.isArray(res) && Object.prototype.hasOwnProperty.apply(res, 'message') && Object.keys(res).length === 1;
    }
}