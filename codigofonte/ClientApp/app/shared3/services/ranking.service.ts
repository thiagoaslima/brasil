import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Ranking } from '../models/ranking.model';
import { niveisTerritoriais } from '../values';
import { ConfigService } from '../../config/config.service';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });
@Injectable()
export class RankingService3 {

    constructor(
        private _http: Http,
        private configService: ConfigService
    ) { }

    public getRankingsIndicador(indicadores: Array<{ indicadorId: number, periodo: string }>, contextos: string[], codigoLocalidade: number) {

        const _contexto = contextos.join(',');
        const _indicadores = indicadores.map(obj => `${obj.indicadorId}(${obj.periodo})`).join('|');
        const tipo = this._getTipoLocalidade(codigoLocalidade);
        const naturezaParams = tipo === 'uf' ? 3 : 4;

        const url = `${this.configService.getConfigurationValue('ENDPOINT_SERVICO_DADOS')}/v1/pesquisas/indicadores/ranking/${_indicadores}?localidade=${codigoLocalidade}&contexto=${_contexto}&upper=0&lower=0&natureza=${naturezaParams}`;

        return this._request(url).map(response => response.map(item => new Ranking(item)));
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