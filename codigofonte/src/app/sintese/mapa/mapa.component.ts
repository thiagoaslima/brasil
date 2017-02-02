import { Component, Input, OnChanges, Inject } from '@angular/core';
import { SinteseService } from '../sintese.service';
import { TopoJson, TOPOJSON } from '../../shared/topojson.v2';
import {ufs} from '../../../api/ufs';
import {municipios} from '../../../api/municipios';
import {Router} from '@angular/router';

@Component({
    selector: 'mapa',
    templateUrl: 'mapa.template.html',
    styleUrls: [ 'mapa.style.css' ]
})

export class MapaComponent implements OnChanges {

    @Input() codlocal;
    public localHover = '';
    public irPara = '';
    public localHoverLink = '';
    public localClicked = '';
    public data;
    public mapauf = false;
    public geom;
    public svgMapPoly;
    public localAtual = '';

    @Input() dados = [
        {"codLocal":"3304557","2010":null,"2015":null,"2016":"6498837","2017":null},
        {"codLocal":"3303609","2010":null,"2015":null,"2016":"8498837","2017":null},
        {"codLocal":"3303708","2010":null,"2015":null,"2016":"2498837","2017":null},
        {"codLocal":"3303807","2010":null,"2015":null,"2016":"5498837","2017":null},
        {"codLocal":"3303401","2010":null,"2015":null,"2016":"3498837","2017":null},
        {"codLocal":"3303906","2010":null,"2015":null,"2016":"7498837","2017":null}
    ];

    constructor(
        private _sinteseService: SinteseService,
        @Inject(TOPOJSON) private _topojson,
        private router: Router
    ) {
    }


    ngOnChanges(evt) {
        this.localHover = '';
        if(this.codlocal > 1){
            // mapa da UF dividida por municípios
            this.mapauf = true;
            this._sinteseService.getMalha(this.codlocal.substr(0, 2), 1)
                .subscribe((malha) => {

                    this.data = this._topojson.feature(malha, malha.objects[this.codlocal.substr(0, 2)]);

                    let myGeom;
                    let n = -90;
                    let s = 90;
                    let l = -90;
                    let o = 90;
                    this.data.geometry = this.data.features.map((ft) => {
                        myGeom = {};
                        myGeom.codigo = ft.properties.cod;

                        console.dir(this.dados);

                        //iterando para captura dos nomes dos municipios/ufs para geração do link e municipio atual
                        municipios.forEach(municipio => {
                            if(municipio.codigoUf.toString() == this.codlocal.substr(0, 2)){
                                if(municipio.codigo.toString().substr(0, 6) == ft.properties.cod.toString().substr(0, 6)){
                                    myGeom.nome = municipio.nome;
                                    if(this.codlocal.substr(0, 6) == ft.properties.cod.toString().substr(0, 6)){
                                        this.localAtual = municipio.nome
                                    }
                                    ufs.forEach(uf => {
                                        if(uf.codigo.toString() == this.codlocal.substr(0, 2)){
                                            myGeom.uf = uf.sigla;
                                            myGeom.link = '/brasil/' + uf.sigla.toLowerCase() + '/' + municipio.slug;
                                        }
                                    });

                                }
                            }
                        });


                        //munic //ano //valor //faixa 
                        // [{munic:'330455',anos:['2010','2016'], valores:['3252215',null], faixa:'faixa2'}]
                        let mapData = [];
                        this.dados.forEach(dado => {
                            let dadosMunic = {munic:'',anos:[], valores:[], faixa:''};
                            //Object.keys(dado) //["2010", "2015", "2016", "2017", "codLocal"]
                            //Object.keys(dado).length //5
                            //dado["2016"] //"8498837"
                            //dado[Object.keys(dado)[2]] //"8498837"
                            dadosMunic.munic = dado.codLocal.substr(0, 6);
                            Object.keys(dado).forEach(ano => {
                                if(Object.keys(dado).length > dadosMunic.anos.length+1){
                                    dadosMunic.anos.push(ano);
                                    dadosMunic.valores.push(dado[ano]);
                                }
                            });
                            mapData.push(dadosMunic);  
                        });
                        console.log('mapData = ',mapData);
                        mapData.forEach(data => {
                            if(data.munic == ft.properties.cod.toString().substr(0, 6)){
                                myGeom.ano =  data.anos[2];
                                myGeom.valor = data.valores[2];
                            }
                        });
                        //myGeom.faixa = dado.codLocal.substr(0,6) == ft.properties.cod.toString().substr(0, 6) ? faixa : '';

                        myGeom.classe = this.codlocal.substr(0, 6) == ft.properties.cod.toString().substr(0, 6) ? "checked" : "unchecked";
                        if (ft.geometry.type == "Polygon") {
                            myGeom.polys = ft.geometry.coordinates.map((poly) => {
                                return [ poly.map((pt) => {
                                    if (n < pt[1]) n = pt[1];
                                    if (s > pt[1]) s = pt[1];
                                    if (l < pt[0]) l = pt[0];
                                    if (o > pt[0]) o = pt[0];
                                    return pt.join(",");
                                }).join(" ") ];
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
                        return myGeom;
                    });

                    // inverte o mapa na vertical...
                    n *= -1;
                    s *= -1;
                    let aux = n;
                    n = s;
                    s = aux;

                    this.data.viewBox = [o, s, (l-o), (n-s)].join(" ");

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
                        myGeom.classe = this.codlocal.substr(0, 2) == ft.properties.cod.toString().substr(0, 2) ? "checked" : "unchecked";
                        if (ft.geometry.type == "Polygon") {
                            myGeom.polys = ft.geometry.coordinates.map((poly) => {
                                return [ poly.map((pt) => {
                                    if (n < pt[1]) n = pt[1];
                                    if (s > pt[1]) s = pt[1];
                                    if (l < pt[0]) l = pt[0];
                                    if (o > pt[0]) o = pt[0];
                                    return pt.join(",");
                                }).join(" ") ];
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

                });
                
            });

        }
            
    }

    over(nome, ano, valor, link){
        this.irPara = 'Ir para:';
        this.localHover = !!valor ? nome + ' (' + ano + ' - ' + valor + ' habitantes)' : nome;
        this.localHoverLink = link.toString();
    }

    clicked(nome, link){
        this.localHoverLink = link.toString();
        this.localClicked === nome.toString() ? this.router.navigate([link.toString()]) : '';
        this.irPara = 'Ir para:';
        this.localHover = nome.toString();
        this.localClicked = nome.toString();
    }

}