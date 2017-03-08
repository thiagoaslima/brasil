import { Component, Input, OnInit, OnChanges, Inject, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { Localidade } from '../../shared/localidade/localidade.interface';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { SinteseService } from '../sintese.service';
import { MapaService } from './mapa.service';
import { TopoJson, TOPOJSON } from '../../shared/topojson.v2';
import { ufs } from '../../../api/ufs';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

interface DadosMapa {
    periodos: string[],
    localidades: {
        [codigoLocalidade: number]: string[]
    }
}

@Component({
    selector: 'mapa',
    templateUrl: 'mapa.template.html',
    styleUrls: ['mapa.style.css']
})
export class MapaComponent implements OnInit, OnChanges {

    @Input() codigoLocalidade;
    @Input() dadosMapa = [];
    public carregando: boolean = true;

    @Input() dados = {} as DadosMapa;
    public codigoParent: BehaviorSubject<number>;
    public malha$: Observable<any>;
    public periodos = [] as string[];
    public periodoSelecionado: BehaviorSubject<string>;
    public geometries: Observable<any>;
    public mapaModel$: Observable<any>;

    public localHover = '';
    public irPara = '';
    public localHoverLink = '';
    public localClicked = '';
    public data;
    public mapauf = false;
    public geom;
    public svgMapPoly;
    public localAtual = '';
    fx1 = '0';
    fx0 = '0';
    faixa1 = 'hide';
    faixa2 = 'hide';
    faixa3 = 'hide';
    faixa0 = 'hide';
    ano = 0;
    anoWasSelected = false;
    anosToSelect = [];
    anoApresentado = '';
    faixas = [];



    private _localidadeServiceSubscription: Subscription;

    constructor(
        private _localidadeService: LocalidadeService,
        private _sinteseService: SinteseService,
        private _mapaService: MapaService,
        @Inject(TOPOJSON) private _topojson,
        private router: Router
    ) { }

    ngOnInit() {
        this.malha$ = this.codigoParent
            .filter(codigo => !!codigo)
            .distinctUntilChanged()
            .flatMap(this._mapaService.getMalhaSubdivisao);

        this.mapaModel$ = Observable.zip(
            this.malha$,
            this.periodoSelecionado
        ).map(([malha, periodo]) => {
            let model = this._topojson.feature(malha, malha.objects[this.codigoParent.getValue()]);
            model.viewBox = "90 90 -180 -180";
            return model;
        });

        this.geometries = this.mapaModel$
            .flatMap(model => Observable.of(model.features))
            .map(feature => {
                const codigoFeature = feature.properties.cod.toString().substr(0, 6);
                const localidade = codigoFeature.length > 2
                    ? this._localidadeService.getMunicipioByCodigo(codigoFeature)
                    : this._localidadeService.getUfByCodigo(codigoFeature);

                let polygons;
                let n = -90; let s = 90; let l = -90; let o = 90;

                if (feature.geometry.type == "Polygon") {
                    polygons = feature.geometry.coordinates.map((poly) => {
                        return [poly.map((point) => {
                            if (n < point[1]) n = point[1];
                            if (s > point[1]) s = point[1];
                            if (l < point[0]) l = point[0];
                            if (o > point[0]) o = point[0];
                            return point.join(",");
                        }).join(" ")];
                    })
                } else if (feature.geometry.type == "MultiPolygon") {
                    polygons = feature.geometry.coordinates.map((MultiPoly) => {
                        return MultiPoly.map((poly) => {
                            return poly.map((point) => {
                                if (n < point[1]) n = point[1];
                                if (s > point[1]) s = point[1];
                                if (l < point[0]) l = point[0];
                                if (o > point[0]) o = point[0];
                                return point.join(",");
                            }).join(" ");
                        })
                    })
                }


                return {
                    codigo: localidade.codigo,
                    nome: localidade.nome,
                    link: localidade.link,
                    polys: polygons,
                    ano: this.anoApresentado,
                    valor: parseFloat(this.dados[localidade.codigo][this.anoApresentado])
                }
            })

    }


    ngOnChanges(changes: SimpleChanges) {

        if (changes.codigoLocalidade && changes.codigoLocalidade.currentValue) {
            let localidadeSelecionada = this._localidadeService.getMunicipioByCodigo(this.codigoLocalidade);
            this.codigoParent.next(localidadeSelecionada.parent.codigo);
        }

        if (changes.dados && changes.dados.currentValue.length) {
            this.periodos = this.dados.periodos;
            this.periodoSelecionado.next(this.periodos[this.periodos.length - 1]);
        }

        if (!!this.codigoLocalidade && !!this.dadosMapa) {

            // this.carregando = true;
            // this.plotMap(this.codigoLocalidade, this.dadosMapa);
        }
    }

    plotMap(codLocal, dados) {

        console.log('dadosMapa', dados);

        if (dados.length > 0) {
            /**
             * Separa os períodos existentes para seleção do usuário 
             * e deixa o mais recente selecionado por default 
             */
            dados.forEach(data => {
                if (data.munic === codLocal.toString().substr(0, 6)) {
                    this.anosToSelect = data.anos; //anos para serem selecionados pelo usuário
                    this.anoWasSelected !== true ? this.ano = data.anos.length - 1 : '';
                }
                if (codLocal < 1) {
                    if (data.munic === dados[0].munic) {
                        this.anosToSelect = data.anos; //anos para serem selecionados pelo usuário
                        this.anoWasSelected !== true ? this.ano = data.anos.length - 1 : '';
                    }
                }
                this.geraMapa(this.ano, codLocal, dados); //valor do índice do ano //pega o ultimo ano por default
                this.anoApresentado = this.anosToSelect[this.ano];
            });
        } else {
            this.geraMapa(0, codLocal, dados);
        }
    }

    geraMapa(anoSelecionado, codLocal: number, dados: any[]) {
        this.localHover = '';

        if (dados.length !== 0) {
            this.anosToSelect = dados[0].anos;

            /**
             * Criando as faixas coropléticas
             */
            this.faixas = this.calculaFaixas(dados, anoSelecionado);

            /**
             * Aplicando a legenda das faixas
             */
            this.faixa0 = dados.length < 27 ? '' : 'hide';
            this.fx1 = this.faixas[1] >= 0 ? parseFloat(this.faixas[1]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.") : '0';
            this.fx0 = this.faixas[0] >= 0 ? parseFloat(this.faixas[0]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.") : '0';
        }

        const hashDados = dados.reduce((agg, dado) => Object.assign(agg, { [dado.munic]: dado }), Object.create(null));

        if (codLocal > 1) {

            // mapa da UF dividida por municípios
            this.mapauf = true;
            this._localidadeServiceSubscription = this._sinteseService.getMalha(codLocal.toString().substr(0, 2), 1)
                .subscribe((malha) => {

                    this.data = this._topojson.feature(malha, malha.objects[codLocal.toString().substr(0, 2)]);

                    let myGeom;
                    let n = -90;
                    let s = 90;
                    let l = -90;
                    let o = 90;
                    this.data.geometry = this.data.features.map((feature) => {
                        let codigoFeature = feature.properties.cod.toString().substr(0, 6);

                        let municipio = this._localidadeService.getMunicipioByCodigo(codigoFeature);

                        myGeom = {};
                        myGeom.codigo = feature.properties.cod;

                        myGeom.nome = municipio.nome;
                        myGeom.uf = municipio.parent.identificador;
                        myGeom.link = municipio.link;
                        myGeom.classe = "unchecked";

                        if (codLocal.toString().substr(0, 6) == codigoFeature) {
                            myGeom.classe = "checked";
                            this.localAtual = municipio.nome;
                        }
                        /**
                         * iterando para captura dos nomes dos municipios/ufs para geração do link e municipio atual
                         */
                        /*
                        municipios.forEach(municipio => {
                            if (municipio.codigoUf.toString() == codLocal.toString().substr(0, 2)) {
                                if (municipio.codigo.toString().substr(0, 6) == ft.properties.cod.toString().substr(0, 6)) {
                                    myGeom.nome = municipio.nome;
                                    if (codLocal.toString().substr(0, 6) == ft.properties.cod.toString().substr(0, 6)) {
                                        this.localAtual = municipio.nome
                                    }
                                    ufs.forEach(uf => {
                                        if (uf.codigo.toString() == codLocal.toString().substr(0, 2)) {
                                            myGeom.uf = uf.sigla;
                                            myGeom.link = '/brasil/' + uf.sigla.toLowerCase() + '/' + municipio.slug;
                                        }
                                    });

                                }
                            }
                        });
                        */

                        if (feature.geometry.type == "Polygon") {
                            myGeom.polys = feature.geometry.coordinates.map((poly) => {
                                return [poly.map((pt) => {
                                    if (n < pt[1]) n = pt[1];
                                    if (s > pt[1]) s = pt[1];
                                    if (l < pt[0]) l = pt[0];
                                    if (o > pt[0]) o = pt[0];
                                    return pt.join(",");
                                }).join(" ")];
                            })
                        } else if (feature.geometry.type == "MultiPolygon") {
                            myGeom.polys = feature.geometry.coordinates.map((MultiPoly) => {
                                return MultiPoly.map((poly) => {
                                    return poly.map((pt) => {
                                        if (n < pt[1]) n = pt[1];
                                        if (s > pt[1]) s = pt[1];
                                        if (l < pt[0]) l = pt[0];
                                        if (o > pt[0]) o = pt[0];
                                        return pt.join(",");
                                    }).join(" ");
                                })
                            })
                        }

                        /**
                         * Verifica se há dados suficientes para gerar o mapa coroplético
                         */
                        if (dados.length !== 0) {

                            // this.anosToSelect = dados[0].anos;

                            /**
                             * Criando as faixas coropléticas
                             */
                            // this.faixas = this.calculaFaixas(dados, anoSelecionado);

                            /**
                             * Aplicando a legenda das faixas
                             */
                            // this.faixa0 = dados.length < 27 ? '' : 'hide';
                            // this.fx1 = this.faixas[1] >= 0 ? parseFloat(this.faixas[1]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.") : '0';
                            // this.fx0 = this.faixas[0] >= 0 ? parseFloat(this.faixas[0]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.") : '0';

                            /**
                             * Relacionando a qual faixa o local se enquadra e inserindo no attr.faixa na malha do mapa
                             */
                            /*
                            dados.forEach(data => {
                                if (data.munic == feature.properties.cod.toString().substr(0, 6)) {
                                    myGeom.ano = data.anos[anoSelecionado];
                                    myGeom.valor = parseFloat(data.valores[anoSelecionado]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.");
                                    myGeom.faixa = !!data.valores[anoSelecionado] ? this.escolheFaixa(data.valores[anoSelecionado], this.faixas) : '';
                                    myGeom.faixa === 'faixa1' ? this.faixa1 = '' : '';
                                    myGeom.faixa === 'faixa2' ? this.faixa2 = '' : '';
                                    myGeom.faixa === 'faixa3' ? this.faixa3 = '' : '';
                                }
                                if (data.munic === codLocal.toString().substr(0, 6)) {

                                }
                            });
                            */

                            let data = hashDados[codigoFeature];
                            myGeom.ano = data.anos[anoSelecionado];
                            myGeom.valor = parseFloat(data.valores[anoSelecionado]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.");
                            myGeom.faixa = !!data.valores[anoSelecionado] ? this.escolheFaixa(data.valores[anoSelecionado], this.faixas) : '';
                            myGeom.faixa === 'faixa1' ? this.faixa1 = '' : '';
                            myGeom.faixa === 'faixa2' ? this.faixa2 = '' : '';
                            myGeom.faixa === 'faixa3' ? this.faixa3 = '' : '';
                        }

                        return myGeom;
                    });

                    // inverte o mapa na vertical...
                    n *= -1;
                    s *= -1;
                    let aux = n;
                    n = s;
                    s = aux;

                    this.data.viewBox = [o, s, (l - o), (n - s)].join(" ");

                    this.carregando = false;

                });

        } else {
            //mapa do brasil dividido por UFs
            let allGeom = [];
            ufs.forEach(uf => {
                this._sinteseService.getMalha(uf.codigo.toString().substr(0, 2), 0)
                    .subscribe((malha) => {

                        this.data = this._topojson.feature(malha, malha.objects[uf.codigo.toString().substr(0, 2)]);

                        let myGeom;
                        let n = -90;
                        let s = 90;
                        let l = -90;
                        let o = 90;

                        this.data.features.map((ft) => {
                            myGeom = {};
                            myGeom.codigo = ft.properties.cod;
                            myGeom.nome = uf.nome;
                            myGeom.sigla = uf.sigla;
                            myGeom.link = '/brasil/' + uf.sigla.toLowerCase();
                            myGeom.classe = codLocal.toString().substr(0, 2) == ft.properties.cod.toString().substr(0, 2) ? "checked" : "unchecked";
                            if (ft.geometry.type == "Polygon") {
                                myGeom.polys = ft.geometry.coordinates.map((poly) => {
                                    return [poly.map((pt) => {
                                        if (n < pt[1]) n = pt[1];
                                        if (s > pt[1]) s = pt[1];
                                        if (l < pt[0]) l = pt[0];
                                        if (o > pt[0]) o = pt[0];
                                        return pt.join(",");
                                    }).join(" ")];
                                })
                            } else if (ft.geometry.type == "MultiPolygon") {
                                myGeom.polys = ft.geometry.coordinates.map((MultiPoly) => {
                                    return MultiPoly.map((poly) => {
                                        return poly.map((pt) => {
                                            if (n < pt[1]) n = pt[1];
                                            if (s > pt[1]) s = pt[1];
                                            if (l < pt[0]) l = pt[0];
                                            if (o > pt[0]) o = pt[0];
                                            return pt.join(",");
                                        }).join(" ");
                                    })
                                })
                            }

                            /**
                             * Verifica se há dados suficientes para gerar o mapa coroplético
                             */
                            if (dados.length !== 0) {

                                this.anosToSelect = dados[0].anos;
                                /**
                                 * Criando as faixas coropléticas
                                 */
                                this.faixas = this.calculaFaixas(dados, anoSelecionado);

                                /**
                                 * Aplicando a legenda das faixas
                                 */
                                this.faixa0 = dados.length < 27 ? '' : 'hide';
                                this.fx1 = this.faixas[1] >= 0 ? parseFloat(this.faixas[1]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.") : '0';
                                this.fx0 = this.faixas[0] >= 0 ? parseFloat(this.faixas[0]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.") : '0';

                                /**
                                 * Relacionando a qual faixa o local se enquadra e inserindo no attr.faixa na malha do mapa
                                 */
                                dados.forEach(data => {
                                    if (data.munic == ft.properties.cod.toString().substr(0, 2)) {
                                        myGeom.ano = data.anos[anoSelecionado];
                                        myGeom.valor = parseFloat(data.valores[anoSelecionado]).toFixed(2).replace(/[.]/g, ",").replace(/\d(?=(?:\d{3})+(?:\D|$))/g, "$&.");
                                        myGeom.faixa = !!data.valores[anoSelecionado] ? this.escolheFaixa(data.valores[anoSelecionado], this.faixas) : '';
                                        myGeom.faixa === 'faixa1' ? this.faixa1 = '' : '';
                                        myGeom.faixa === 'faixa2' ? this.faixa2 = '' : '';
                                        myGeom.faixa === 'faixa3' ? this.faixa3 = '' : '';
                                    }
                                    if (data.munic === codLocal.toString().substr(0, 2)) {

                                    }
                                });

                            }

                            allGeom.push(myGeom);
                        });

                        this.data.geometry = allGeom;

                        // inverte o mapa na vertical...
                        n *= -1;
                        s *= -1;
                        let aux = n;
                        n = s;
                        s = aux;

                        this.data.viewBox = "-13.45 -0.97 7.344 7.100";

                        this.carregando = false;

                    });

            });

        }

    }

    over(nome, ano, valor, link) {
        this.irPara = 'Ir para:';
        this.localHover = !!valor ? nome + ' (' + ano + ' - ' + valor + ')' : nome;
        this.localHoverLink = link.toString();
    }

    clicked(nome, link) {
        this.localHoverLink = link.toString();
        this.localClicked === nome.toString() ? this.router.navigate([link.toString()]) : '';
        this.irPara = 'Ir para:';
        this.localHover = nome.toString();
        this.localClicked = nome.toString();
    }

    /**
     *  Retorna as faixas para o mapa coroplético a partir dos dados recebidos e do período selecionado
     */
    calculaFaixas(mapData, anoSelecionado) {
        let faixas = [];
        let distribuicao = Math.floor(mapData.length / 3);// 27 / 3 = 9

        if (distribuicao >= 1) { //se encontrar mais de 3 ufs
            faixas.push(parseFloat(mapData[distribuicao - 1].valores[anoSelecionado]).toFixed(2)); // = 9 maiores
            faixas.push(parseFloat(mapData[(distribuicao * 2) - 1].valores[anoSelecionado]).toFixed(2)); // = 9-18
            faixas.push(parseFloat(mapData[(distribuicao * 3) - 1].valores[anoSelecionado]).toFixed(2)); // = 18-27 //menor de todos
        } else { //2,1 ufs
            faixas.push(mapData[0].valores[anoSelecionado]); // 1 uf
            if (mapData.length == 2) {
                faixas.push(mapData[1].valores[anoSelecionado]); //2 ufs
            } else { faixas.push(' - '); } //2 vazio
            faixas.push(' - '); // 3 vazio
        }
        return faixas;
    }

    /**
     * Retorna qual a faixa que o local se enquadra, para o mapa coroplético
     */
    escolheFaixa(valor, faixas) {
        let faixaRecebida = '';
        if (isNaN(valor) || valor === "" || valor === null) {
            faixaRecebida = '';
        } else {
            let valorNumber = parseFloat(valor);

            if (valorNumber.toFixed(2) < parseFloat(faixas[1]).toFixed(2)) {
                faixaRecebida = 'faixa1';
                //this.faixa1 = '';
            } else if (valorNumber.toFixed(2) <= parseFloat(faixas[0]).toFixed(2)) {
                faixaRecebida = 'faixa2';
                //this.faixa2 = '';
            } else {
                faixaRecebida = 'faixa3'; // maiores frequencias
                //this.faixa3 = '';
            }
        }
        return faixaRecebida;
    }

    selectAno(ano) {
        console.log(ano);
        this.anoWasSelected = true;
        this.ano = ano;
        this.irPara = '';
        this.plotMap(this.codigoLocalidade, this.dadosMapa);
    }

}