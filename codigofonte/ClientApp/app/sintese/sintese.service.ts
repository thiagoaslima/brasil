import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/switchMap';

import { EscopoIndicadores } from '../shared2/indicador/indicador.model'
import { SINTESE, SinteseConfigItem } from './sintese-config';
import { flatTree } from '../utils/flatFunctions';
import { ufs } from '../../api/ufs';
import { LocalidadeService3 } from '../shared3/services';


const headers = new Headers({ 'accept': '*/*' });
const options = new RequestOptions({ headers: headers, withCredentials: false });

/**
 * Serviço responsável por recuperar as informações de sínteses e pesquisas.
 */
@Injectable()
export class SinteseService {

    // Lista de pesquisas estão autorizadas a serem acessadas pelo serviço.
    private idPesquisasValidas: number[] = [11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43];
    idioma:string;

    constructor(
        private _http: Http,
        private _sinteseConfig: SINTESE,
        private _localidadeService: LocalidadeService3
    ) { 

        this.idioma = 'PT';
    }

   /**
     * Obtém notas e fontes da pesquisa solicitada.
     */
    public getInfoPesquisa(pesquisa: string) {
        
        return this._http.get(`https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}?lang=${this.idioma}`)
            .map((res) => res.json())
            .map((pesquisa) => {

                return {
                    id: pesquisa.id,
                    descricao: pesquisa.descricao || pesquisa.nome,
                    periodos: pesquisa.periodos
                }

            });
    }

    public getIndicadoresPesquisa(pesquisaId: number, posicaoIndicador: string, escopo = EscopoIndicadores.proprio) {

        const serviceEndpoint = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${posicaoIndicador}?scope=${escopo}&lang=${this.idioma}`;
        return this._http.get(serviceEndpoint, options).map((res => res.json()));
    }

    public getResultadoPesquisa(pesquisaId: number, posicaoIndicador: string, codigoLocalidade: string, escopo = EscopoIndicadores.proprio) {

        if(codigoLocalidade == undefined){

            return Observable.of({});
        }

        const serviceEndpoint = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${posicaoIndicador}/resultados/${codigoLocalidade}?scope=${escopo}&${this.idioma}`;

        const dadosPesquisa$ = this._http.get(serviceEndpoint)
            .map((res => res.json()))
            .map(this._excludeNullYearsFromResultados);

        return dadosPesquisa$.map((dados) => {

            let indicadores = {};
            dados.map((dado: any) => {

                return dado.res.filter((res: any) => {

                    return !!res.localidade && res.localidade === codigoLocalidade;
                })
                    .forEach((res: any) => {
                        indicadores[dado.id.toString()] = res.res;
                    });
            });

            return indicadores;
        });
    }

    public getResultadoPesquisa2(pesquisaId: number, posicaoIndicador: string, codigoUF: number, escopo = EscopoIndicadores.arvore) {

        let codigoCoringaTodosMunucipiosUF = codigoUF == 0 ? 'xx' : `${codigoUF}xxxx`;

        const serviceEndpoint = `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisaId}/periodos/all/indicadores/${posicaoIndicador}/resultados/${codigoCoringaTodosMunucipiosUF}?scope=${escopo}&${this.idioma}`;

        const dadosPesquisa$ = this._http.get(serviceEndpoint, options)
            .map((res => res.json()))
            .map(this._excludeNullYearsFromResultados);

        return dadosPesquisa$.map((dados) => {

            let indicadores = [];
            dados.map((dado: any) => {

                return indicadores[dado.id] = dado.res;
            });

            return indicadores;
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

        const codigoIndicadores = indicadores.length > 0 ? "indicadores=" + indicadores.join(',') : "";

        const dadosPesquisa$ = this._http.get(`https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}/periodos/all/resultados?localidade=${codigoLocal}&${codigoIndicadores}&${this.idioma}`)
            .map((res => res.json()))
            .map(this._excludeNullYearsFromResultados);

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
        if (!pesquisa) {
            
        }
       
        const nomesPesquisa$ = this._http.get(
            `https://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}/periodos/all/indicadores?lang=${this.idioma}`, options
        ).map((res => res.json()));

        return nomesPesquisa$
            .map((res) => {

                return res.filter((res) => {

                    if (indicadores.length > 0) {
                        return indicadores.indexOf((res.id).toString()) >= 0;
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


                this.atribuirValorIndicadoresPesquisa('children', nomes, dados);

                return nomes;
            });
    }

    public getPesquisaLocalidades(pesquisaId: number, codigoLocalidadeA, codigoLocalidadeB, codigoLocalidadeC, posicaoIndicador: string, escopo = EscopoIndicadores.proprio) {
        
        return Observable.zip(
            this.getIndicadoresPesquisa(pesquisaId, posicaoIndicador, escopo),
            this.getResultadoPesquisa(pesquisaId, posicaoIndicador, codigoLocalidadeA, escopo),
            this.getResultadoPesquisa(pesquisaId, posicaoIndicador, codigoLocalidadeB, escopo),
            this.getResultadoPesquisa(pesquisaId, posicaoIndicador, codigoLocalidadeC, escopo)
            )
            .map(([nomes, dadosA, dadosB, dadosC]) => {
                
                this.atribuirValorIndicadoresLocalidades('children', nomes, dadosA, dadosB, dadosC);

                return nomes;
            });
    }


    public getPesquisaCompletaLocalidades(pesquisaId: number, codigoUF: number, posicaoIndicador: string, escopo = EscopoIndicadores.arvore) {

        return Observable.zip( 
                    this.getIndicadoresPesquisa(pesquisaId, posicaoIndicador, escopo), 
                    this.getResultadoPesquisa2(pesquisaId, posicaoIndicador, codigoUF, escopo) 
                )
                .map(([nomes, dados]) => {

                    return this.percorrerSubIndicadores(nomes, dados);
                });
    }

    private percorrerSubIndicadores(listaIndicador, dados): any[]{

        let indicadores = [];

        listaIndicador.forEach(indicador => {

            indicadores.push( {
                id: indicador.id,
                nome: indicador.indicador,
                posicao: indicador.posicao,
                unidade: indicador.unidade ? indicador.unidade.id : '',
                multiplicador: indicador.unidade ? indicador.unidade.multiplicador : '',
                notas: indicador.nota,
                resultado: dados[indicador.id] ? dados[indicador.id].map(res => {

                    res.nomeLocalidade = this._localidadeService.getByCodigo(res.localidade)[0].nome;

                    return res;
                }) : ''
            } );

            if(!!indicador.children && indicador.children.length > 0){

                indicadores = indicadores.concat( this.percorrerSubIndicadores(indicador.children, dados) );
            }

        })

        return indicadores;
    }


    /**
     * Obtém o histórico de um munucípio, dado seu código.
     * 
     */
    public getHistorico(codigoLocalidade: number) {

        let codigo: string = codigoLocalidade.toString().substr(0, 6);

        //estados tem código de 2 dígitos
        if(codigo.length <= 2){
            //implemetar chamada que retorna histórido dos estados, assim que estiverem cadastrados
            return Observable.of({
                historico: undefined,
                fonte: undefined,
                formacaoAdministrativa: undefined
            });
        }

        //municípios
        return this._http.get(`https://servicodados.ibge.gov.br/api/v1/biblioteca?aspas=3&codmun=${codigo}`)
            .map((res) => {

                return res.json();
            })
            .map((res) => {

                let key = Object.keys(res).find((key) => {
                    return key.indexOf(codigo) == 0;
                });

                return res[key];
            })
            .map((res) => {

                return {

                    historico: res && res.HISTORICO,
                    fonte: res && res.HISTORICO_FONTE,
                    formacaoAdministrativa: res && res.FORMACAO_ADMINISTRATIVA
                }
            });
    }

    public getFotografias(codigoMunicipio: number) {

        let codigo = codigoMunicipio.toString().substr(0, 6);

        return this._http.get(
            `https://servicodados.ibge.gov.br/api/v1/biblioteca?codmun=${codigo}&aspas=3&fotografias=1&serie=Acervo%20dos%20Trabalhos%20Geogr%C3%A1ficos%20de%20Campo|Acervo%20dos%20Munic%C3%ADpios%20brasileiros`
        )
            .map(res => res.json())
            .map((res) => {
                return Object.keys(res).map((key) => res[key]);
            });
    }


    private atribuirValorIndicadoresPesquisa(attr, elements, valueList) {

        elements.forEach((obj) => {

            obj["res"] = valueList[obj.id];

            if (obj[attr]) {

                this.atribuirValorIndicadoresPesquisa(attr, obj[attr], valueList);
            }
        });
    }

    private atribuirValorIndicadoresLocalidades(attr, elements, valueListA, valueListB, valueListC) {

        elements.forEach((obj) => {

            obj["localidadeA"] = valueListA[obj.id];
            obj["localidadeB"] = valueListB[obj.id];
            obj["localidadeC"] = valueListC[obj.id];

            if (obj[attr]) {

                this.atribuirValorIndicadoresLocalidades(attr, obj[attr], valueListA, valueListB, valueListC);
            }
        });
    }

    /**
     * Obtém os valores históricos de um dado indicador da síntese.
     * 
     * @Deprecated: utilize getPesquisa(pesquisa, local, indicadores: string[])
     * 
     * @local: string - código da localidade.
     * @indicador: string - codigo do indicador.
     */
    public getDetalhesIndicadorSintese(local: string, indicador: string) {

        return this.getPesquisa('33', local, [indicador]);
    }

    /**
     * Obtém as informações da pesquisa que possui o indicador.
     * 
     * @indicador: string - codigo do indicador.
     * 
     * return {codigo: string, nome: string}
     */
    public getPesquisaByIndicadorDaSinteseMunicipal(indicador: string) {
        let _indicador = parseInt(indicador, 10);
        /*
        const indicadoresMap = {
            '29169': { codigo: '33', nome: 'Síntese municipal' },
            '29170': { codigo: '33', nome: 'Síntese municipal' },
            '29167': { codigo: '33', nome: 'Síntese municipal' },
            '29171': { codigo: '33', nome: 'Síntese municipal' },
            '29168': { codigo: '33', nome: 'Síntese municipal' },
            '28160': { codigo: '21', nome: 'Finanças públicas' },
            '47001': { codigo: '38', nome: 'PIB municipal' },
            '30255': { codigo: '37', nome: 'IDH' },
            '30277': { codigo: '40', nome: 'IDEB' },
            '28311': { codigo: '32', nome: 'Serviços de saúde' }
        };
        */

        let item = this._sinteseConfig.municipio.filter(item => {
            if (item.indicador) return item.indicador === _indicador;
            if (item.composicao) return item.composicao.indicadores.map(ind => ind.indicador).indexOf(_indicador) > -1;
        })[0];

        if (item.pesquisa) return { codigo: item.pesquisa };

        return { codigo: item.composicao.indicadores[0].pesquisa };

        // return indicadoresMap[indicador];
    }

    /**
     * Simplifica a resposta do indicador, resumindo o objeto "res" para o ano mais próximo com dado válido
     * 
     * @dados: object - resposta de indicador do método getPesquisa
     */
    public filterLastValidValue(dados) {
        if (!dados || !dados.res) return dados;
        dados.value = Object.keys(dados.res)
            .map(ano => Number.parseInt(ano, 10))
            .sort()
            .reduce((agg, ano) => {
                let _ano = ano.toString();
                return (!!dados.res[_ano])
                    ? dados.res[_ano]
                    : agg;
            }, {});
        return dados;
    }


    /**
     * Malha para geração do cartograma
     * 
     * 
     */
    public getMalha(codigo, nivel) {
        let convertTarsus2TopoJson = (tarsus) => {
            let simpler = tarsus2Simpler(tarsus);
            let topoJson = simpler2TopoJson(simpler);
            return topoJson;
        }
        let simpler2TopoJson = (simpler) => {
            let objects = {};
            let estados = simpler[3];
            estados.forEach((estado) => {
                let geometries = [];
                let cod = estado[0];
                let munics = estado[1];
                munics.forEach((munic) => {
                    let codMunic = munic[0];
                    let arcs = munic[1];
                    let type = typeof (arcs[0][0][0]) === 'undefined' ? 'Polygon' : 'MultiPolygon'; // testa se é um array
                    let geometry = {
                        arcs: arcs,
                        type: type,
                        properties: {
                            cod: codMunic
                        }
                    };
                    geometries.push(geometry);
                });
                objects[cod] = {
                    type: 'GeometryCollection',
                    geometries: geometries
                };
            });
            let topo = {
                type: 'Topology',
                transform: {
                    scale: simpler[0],
                    translate: simpler[1]
                },
                arcs: simpler[2],
                objects: objects,
                bbox: simpler[4]
            };
            return topo;
        }
        let tarsus2Simpler = (tarsus) => {
            let myStr = tarsus;
            let replaces = [["\\],\\[0", "a"], ["\\],\\[1", "b"], ["\\],\\[-1", "c"], ["\\],\\[2", "d"], ["\\],\\[-2", "e"], ["\\],\\[3", "f"], ["\\],\\[-3", "g"], ["\\],\\[4", "h"], ["\\],\\[-4", "i"], ["\\],\\[5", "j"], ["\\],\\[-5", "k"], ["\\],\\[6", "l"], ["\\],\\[-6", "m"], ["\\],\\[7", "n"], ["\\],\\[-7", "o"], ["\\],\\[8", "p"], ["\\],\\[-8", "q"], ["\\],\\[9", "r"], ["\\],\\[-9", "s"], ["\\]\\],\\[\\[", "t"], ["\\]\\]", "u"], [",\\[\\[", "v"], ["\\[\\[", "x"], [",0", "A"], [",1", "B"], [",-1", "C"], [",2", "D"], [",-2", "E"], [",3", "F"], [",-3", "G"], [",4", "H"], [",-4", "I"], [",5", "J"], [",-5", "K"], [",6", "L"], [",-6", "M"], [",7", "N"], [",-7", "O"], [",8", "P"], [",-8", "Q"], [",9", "R"], [",-9", "S"]];
            replaces.reverse().forEach((rep) => {
                myStr = myStr.replace(new RegExp(rep[1], 'g'), rep[0].replace(/\\/g, ''));
            });
            let simpler = JSON.parse(myStr);
            return simpler;
        }

        return this._http.get(
            `https://servicomapas.ibge.gov.br/api/mapas/${codigo}/${nivel}`
        ).map((res) => {
            let data = res.json();
            return convertTarsus2TopoJson(data.Tarsus);
        })

    }

 

    _excludeNullYearsFromResultados(json) {
        /* elimina os anos que todas as localidades tenham valor null */
        return json.map(obj => {
            let resultados = obj.res;
            let periodos = Object.keys(resultados[0].res);

            periodos = periodos.filter(periodo => resultados.some(({ res }) => res[periodo] != null));

            resultados = resultados.map(resultado => {
                let res = periodos.reduce((agg, periodo) => Object.assign(agg, { [periodo]: resultado.res[periodo] }), {});
                return {
                    localidade: resultado.localidade,
                    res: res
                }
            });

            return {
                id: obj.id,
                res: resultados
            }
        });
    }
}