import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { slugify } from '../utils/slug.ts';

/**
 * Serviço responsável por recuperar as informações de sínteses e pesquisas.
 */
@Injectable()
export class SinteseService{

    // Lista de pesquisas estão autorizadas a serem acessadas pelo serviço.
    private idPesquisasValidas: number[] = [11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 42, 43];


    constructor(private _http: Http) {  }


    /**
     * Obtém a lista de pesquisas disponíveis para a aplicação.
     */
    public getPesquisasDisponiveis() {

        return this._http.get('http://servicodados.ibge.gov.br/api/v1/pesquisas/')
            .map((res) => res.json())
            .map((pesquisas) => {
                let _pesquisas = pesquisas
                    .filter((pesquisa) => {

                        return this.idPesquisasValidas.indexOf(pesquisa.id) >= 0;
                    })
                    .map((pesquisa) => {

                        return {
                            id: pesquisa.id,
                            descricao: pesquisa.descricao || pesquisa.nome
                        }
                    });

                return _pesquisas;
            });
    }


    /**
     * Recupera apenas os dados da pesquisa, ignorando os rótulos dos indicadores.
     * 
     * @pesquisa: string - código da pesquisa.
     * @local: string - código da localidade.
     * @indicadores: string[] - lista de indicadores a serem recuperados.
     */
    public getDadosPesquisa(pesquisa: string, local: string, indicadores: string[] = []) {

        const codigoLocal = local.substr(0, 6);

        const codigoIndicadores = indicadores.length > 0 ? `indicadores=${indicadores.join(',')}` : '';

        const dadosPesquisa$ = this._http.get(`http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}/periodos/all/resultados?localidade=${codigoLocal}&${codigoIndicadores}`).map((res => res.json()));

        return dadosPesquisa$.map((dados) => {

                let indicadores = {};
                dados.map((dado: any) => {

                    return dado.res.filter((res: any) => {

                        return !!res.localidade && res.localidade === codigoLocal;
                    })
                    .forEach((res: any) => {
                        indicadores[dado.id.toString()] = res.res;
                    });
                });

                return indicadores;
            });
    }


    /**
     * Recupera somente os nomes dos indicadores da pesquisa, ignorando seus valores.
     * 
     * @pesquisa: string - código da pesquisa.
     * @indicadores: string[] - lista de indicadores a serem recuperados. Se não informado, obtém todos os indicadores da pesquisa.
     */
    public getNomesPesquisa(pesquisa: string, indicadores: string[] = []) {

        const nomesPesquisa$ = this._http.get(
                `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}/periodos/all/indicadores`
            ).map((res => res.json()));

        return nomesPesquisa$
            .map((res) => {

                return res.filter((res) => {

                    if (indicadores.length > 0) {
                        return indicadores.indexOf((res.id).toString()) >= 0
                    }

                    return true;
                })
            });
    }


    /**
     * Recupera uma pesquisa com os indicadores selecionados, incluíndo rótulos dos indicadores e seus valores.
     * 
     * @pesquisa: string - código da pesquisa.
     * @local: string - código da localidade.
     * @indicadores: string[] - lista de indicadores a serem recuperados.
     */
    public getPesquisa(pesquisa: string, local: string, indicadores: string[] = []) {

        return Observable.zip(this.getNomesPesquisa(pesquisa, indicadores), this.getDadosPesquisa(pesquisa, local, indicadores))
            .map(([nomes, dados]) => {

                return (<any[]>nomes).map((nome) => {

                        nome["res"] = dados[nome.id];

                        return nome;
                    });
            });
    }


    /**
     * Recupera a síntese de uma dada localidade.
     * 
     * @local: string - código da localidade.
     */
    public getSinteseLocal(local: string){

        return this.getPesquisa('33', local, ["29169", "29170", "29167", "29171", "29168"]);
    }


    /**
     * Obtém os valores históricos de um dado indicador da síntese.
     * 
     * @local: string - código da localidade.
     * @indicador: string - codigo do indicador.
     */
    public getDetalhesIndicadorSintese(local: string, indicador: string){
 
        return this.getPesquisa('33', local, [indicador])
    }

}