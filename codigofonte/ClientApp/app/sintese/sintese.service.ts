import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Pesquisa, Indicador } from '../shared/pesquisa/pesquisa.interface.2';
import { PesquisaService } from '../shared/pesquisa/pesquisa.service.2';
import { LocalidadeService } from '../shared/localidade/localidade.service';
import { SINTESE, SinteseConfigItem } from './sintese-config';
import { flatTree } from '../utils/flatFunctions';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/switchMap';
import { ufs } from '../../api/ufs';


/**
 * Serviço responsável por recuperar as informações de sínteses e pesquisas.
 */
@Injectable()
export class SinteseService {

    // Lista de pesquisas estão autorizadas a serem acessadas pelo serviço.
    private idPesquisasValidas: number[] = [11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43];

    constructor(
        private _http: Http,
        private _pesquisaService: PesquisaService,
        private _localidadeService: LocalidadeService,
        private _sinteseConfig: SINTESE
    ) { }


    /**
     * Monta o array de dados a ser consumido pela view
     */
    getConteudo(lista: SinteseConfigItem[], codigoLocalidade: number) {
        return lista.map(item => {
            if (item.pesquisa && item.indicador) {

                let valor$ = Observable.zip(
                    this._pesquisaService.getPesquisa(item.pesquisa),
                    this._pesquisaService.getIndicadores(item.pesquisa, item.indicador),
                    this._pesquisaService.getResultados(item.pesquisa, item.indicador, codigoLocalidade)
                ).flatMap(([pesquisa, indicadores, resultados]) => {
                    let indicador = indicadores[0];
                    return indicador.resultadosValidosMaisRecentes(codigoLocalidade).map(res => {
                        return {
                            periodo: res.periodos[0],
                            valor: res.resultados[res.periodos[0]]
                        }
                    });
                }).share();

                return {
                    nome: item.nome,
                    link: item.indicador,
                    query: item.query || {},
                    valor: valor$,
                    unidade: this._pesquisaService.getIndicadores(item.pesquisa, item.indicador).map((indicador: Indicador[]) => indicador[0].unidade.id),
                    tema: item.tema,
                    largura: item.largura || 'full'
                };
            }

            if (item.composicao) {
                let pesquisaId = item.composicao.indicadores[0].pesquisa;
                let indicadoresId = item.composicao.indicadores.map(indicador => indicador.indicador);

                let indicadores$ = Observable.zip(
                    this._pesquisaService.getPesquisa(pesquisaId),
                    this._pesquisaService.getIndicadores(pesquisaId, indicadoresId),
                    this._pesquisaService.getResultados(pesquisaId, indicadoresId, codigoLocalidade)
                )

                let periodo$ = indicadores$.flatMap(([pesquisa, indicadores, resultados]) => {
                    return indicadores[0].resultadosValidosMaisRecentes(codigoLocalidade).map(res => res.periodos[0]);
                });

                let composicao$ = indicadores$.flatMap(([pesquisa, indicadores, resultados]) => {
                    return item.composicao.make(indicadores, codigoLocalidade);
                });

                let valor$ = Observable.zip(
                    periodo$,
                    composicao$
                ).map(([periodo, dados]) => {
                    return {
                        periodo: periodo,
                        valor: dados
                    }
                }).share();

                return {
                    nome: item.nome,
                    link: item.link,
                    query: item.query || {},
                    valor: valor$,
                    unidade: Observable.of(item.unidade || ''),
                    tema: item.tema,
                    largura: item.largura || 'full'
                }

            }

            if (item.link) {
                return {
                    nome: item.nome,
                    link: item.link,
                    query: item.query || {},
                    valor: Observable.of(null),
                    unidade: Observable.of(''),
                    tema: item.tema,
                    largura: item.largura || 'full'
                };
            }
        })


        //return Observable.of(observables).flatMap(val => val);
    }

    getDadosConteudo(lista: SinteseConfigItem[], codigoLocalidade: number) {
        lista
    }


    /**
     * Obtém a lista de pesquisas disponíveis para a aplicação.
     */
    public getPesquisasDisponiveis() {

        return this._pesquisaService.getAllPesquisas()
            .map(pesquisas => pesquisas.map(pesquisa => ({
                id: pesquisa.id,
                descricao: pesquisa.descricao || pesquisa.nome
            })));

        // return this._http.get('http://servicodados.ibge.gov.br/api/v1/pesquisas/')
        //     .map((res) => res.json())
        //     .map((pesquisas) => {
        //         let _pesquisas = pesquisas
        //             .filter((pesquisa) => {
        //                 return this.idPesquisasValidas.indexOf(pesquisa.id) >= 0;
        //             })
        //             .map((pesquisa) => {
        //                 return {
        //                     id: pesquisa.id,
        //                     descricao: pesquisa.descricao || pesquisa.nome
        //                 }
        //             });

        //         return _pesquisas;
        //     });
    }

    /**
     * Obtém notas e fontes da pesquisa solicitada.
     */
    public getInfoPesquisa(pesquisa: string) {

        return this._http.get(`http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}`)
            .map((res) => res.json())
            .map((pesquisa) => {

                return {
                    id: pesquisa.id,
                    descricao: pesquisa.descricao || pesquisa.nome,
                    periodos: pesquisa.periodos
                }

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

        const dadosPesquisa$ = this._http.get(`http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}/periodos/all/resultados?localidade=${codigoLocal}&${codigoIndicadores}`)
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
            debugger;
        }

        const nomesPesquisa$ = this._http.get(
            `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}/periodos/all/indicadores`
        ).map((res => res.json()));

        return nomesPesquisa$
            .map((res) => {


                return res;

                // return flatTree(res).filter((res) => {

                //     if (indicadores.length > 0) {
                //         return indicadores.indexOf((res.id).toString()) >= 0
                //     }

                //     return true;
                // })
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

                debugger;

                this.atribuirValorIndicadoresPesquisa('children', nomes, dados);

                return nomes;
            });
    }

    /**
     * Obtém o histórico de um munucípio, dado seu código.
     * 
     */
    public getHistorico(codigoLocalidade: number) {

        let codigo: string = codigoLocalidade.toString().substr(0, 6);

        return this._http.get(`http://servicodados.ibge.gov.br/api/v1/biblioteca?aspas=3&codmun=${codigo}`)
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
            `http://servicodados.ibge.gov.br/api/v1/biblioteca?codmun=${codigo}&aspas=3&fotografias=1&serie=Acervo%20dos%20Trabalhos%20Geogr%C3%A1ficos%20de%20Campo|Acervo%20dos%20Munic%C3%ADpios%20brasileiros`
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

    /**
     * Recupera a síntese de uma dada localidade.
     * 
     * @local: string - código da localidade.
     */
    public getSinteseLocal(local: string) {

        /*
            codigo      33    29169
            prefeito    33    29170
    
            area        33    29167
            altitude    ?
    
            pop estimada    33    29171
            dens demograf    33    29168
    
            orçamento        ?
            FPM            21    28160
    
            PIB per capita   38    47001 
            Salário médio    ?
    
            IDHM     37    30255
            IDEB    40    30277
    
            Leitos hospitalares    32    28311
    
            agricultura     necessário vir do servidor
    
            Desocupação (não há no servidor ainda)
        */


        return Observable.zip(
            this.getPesquisa('33', local, ["29169", "29170", "29167", "29171", "29168"]),
            this.getPesquisa('21', local, ['28160']),
            this.getPesquisa('38', local, ['47001']),
            this.getPesquisa('37', local, ['30255']),
            this.getPesquisa('40', local, ['30277']),
            this.getPesquisa('32', local, ['28311'])
        ).map((resp) => {
            return resp.reduce((agg, pesq) => agg.concat(pesq), []);
        }).map(dados => dados.map(this.filterLastValidValue))
            .map(dados => dados.reduce((agg, dado) => {
                agg[dado.id] = dado;
                return agg;
            }, {}));
    }

    // public getDadosIndicadoresSintese() {
    //     return this._pesquisaService.getIndicadores()
    // }

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
            `http://servicomapas.ibge.gov.br/api/mapas/${codigo}/${nivel}`
        ).map((res) => {
            let data = res.json();
            return convertTarsus2TopoJson(data.Tarsus);
        })

    }

    /**
     * Recupera apenas os dados da pesquisa, ignorando os rótulos dos indicadores.
     * 
     * @pesquisa: string - código da pesquisa.
     * @local: string[] - lista de códigos de localidade.
     * @indicador: string - indicador a ser recuperado.
     */
    public getDadosPesquisaMapa(pesquisa: string, local: string[] = [], indicador: string): Observable<any> {

        let locaisCorrigidos = local.map(local => local.substr(0, 6));

        const codigoLocal = locaisCorrigidos.length > 0 ? locaisCorrigidos.join(',') : "";

        const codigoIndicador = indicador;

        const dadosPesquisa$ = this._http.get(
            `http://servicodados.ibge.gov.br/api/v1/pesquisas/${pesquisa}/periodos/all/resultados?localidade=${codigoLocal}&indicadores=${codigoIndicador}`
        )
            .map((res => res.json()))
            .map(this._excludeNullYearsFromResultados);

        return dadosPesquisa$;
    }

    getPesquisaByIndicador(idIdentificador: number) {

        // Obter o código de todas as pesquisas
        return Observable.from(this.idPesquisasValidas)
            .flatMap(idPesquisa => {

                let pesquisa$ = this.getInfoPesquisa(idPesquisa.toString());
                let indicadores$ = this.getNomesPesquisa(idPesquisa.toString(), [idIdentificador.toString()]);

                return Observable.zip(pesquisa$, indicadores$)
                    .map(([pesquisa, indicadores]) => {

                        pesquisa['indicadores'] = indicadores;

                        return pesquisa;
                    })
            })
            .filter(pesquisa => !!pesquisa && pesquisa['indicadores'].length > 0);
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