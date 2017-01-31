import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterParamsService } from '../../shared/router-params.service';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { GraficoComponent } from '../grafico/grafico.component';
import { Subscription } from 'rxjs/Subscription';
var FileSaver = require('file-saver');
var converter = require('json-2-csv');


@Component({
    selector: 'sintese-header',
    templateUrl: 'sintese-header.template.html',
    styleUrls: ['sintese-header.style.css']
})
export class SinteseHeaderComponent implements OnInit, OnDestroy {

    public ativo = 'cartograma'; //pode ser 'grafico' ou 'mapa'
    public titulo;
    public pesquisa;
    public codPesquisa;
    public valoresIndicador;

    private _subscription: Subscription

    @Output() ativarComponente = new EventEmitter();

    constructor(
        private _routerParams:RouterParamsService,
        private _sinteseService:SinteseService, 
        private _localidade:LocalidadeService
    ){}

    ngOnInit(){
        this._subscription = this._routerParams.params$.subscribe((params)=>{

            if(params.indicador){
                let dadosMunicipio = this._localidade.getMunicipioBySlug(params.uf, params.municipio);
                let codigoMunicipio = dadosMunicipio.codigo.toString().substr(0, 6);
                let dadosPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params.indicador);
                this._sinteseService.getPesquisa(dadosPesquisa.codigo, codigoMunicipio, [params.indicador]).subscribe((dados) => {

                    this.titulo = dados[0].indicador; //descrição textual do indicador presente na rota
                    this.pesquisa = dadosPesquisa.nome; //pega o nome da pesquisa de onde esse indicador vem
                    this.codPesquisa = dadosPesquisa.codigo; //pega o código da pesquida

                    for (let k in dados[0].res) {

                        dados[0].res[k] = <string>dados[0].res[k].replace(',', '.');
                    }

                    this.valoresIndicador = dados[0].res;
                });
            }
        });

    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    public ativar(tipo){
        this.ativo = tipo;
        this.ativarComponente.emit(this.ativo);
    }

    private downloadCSV(conteudo){

        converter.json2csv(conteudo, (erro, csv) => {

            if(!erro){

                  this.save(csv, 'text/csv');
            }
        });
    }

    public save(conteudo, tipo) {

        let extensao = tipo == 'image/jpeg' ? '.jpeg' : '.csv';

        let blob = new Blob([conteudo], { type: tipo });

        FileSaver.saveAs(blob, this.titulo + extensao);

    }

}