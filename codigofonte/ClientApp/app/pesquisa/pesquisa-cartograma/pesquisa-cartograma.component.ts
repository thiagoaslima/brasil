import { Observable } from 'rxjs/Rx';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { LinhaTempo } from '../../infografia/linha-tempo/linha-tempo.component';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb.component';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { ResultadoService3 } from '../../shared3/services/resultado.service';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';

@Component({
    selector: 'pesquisa-cartograma',
    templateUrl: './pesquisa-cartograma.template.html',
    styleUrls: ['./pesquisa-cartograma.style.css']
})

export class PesquisaCartogramaComponent implements OnInit, OnChanges {

    @Input() localidades;
    @Input() indicadores;
    @Input() indicadorSelecionado;
    @Input() pesquisa;

    @Output() onAno = new EventEmitter;

    public mapas: {mun, resultados}[] = [];

    public mun;

    public resultados;
    public tituloCartograma;

    public listaPeriodos
    public indexSelecionado;
    public anoSelecionado;

    constructor(
        private _localidadeServ: LocalidadeService2,
        private _resultadoServ: ResultadoService3,
        private _pesquisaService: PesquisaService2,
        private _routerParamsService: RouterParamsService
    ) { }

    ngOnInit() {

        this._routerParamsService.params$.subscribe((params) => {
            this._pesquisaService.getPesquisa(params.params.pesquisa).subscribe((pesquisa) => {
                this.pesquisa = pesquisa;
                this.listaPeriodos = pesquisa.periodos.slice(0).reverse();

                if(params.queryParams.ano){
                    this.anoSelecionado = params.queryParams.ano;
                }
                else {
                    // Quando não houver um período selecionado, é exibido o período mais recente
                    this.anoSelecionado = Number(this.pesquisa.periodos.sort((a, b) =>  a.nome > b.nome ? 1 : -1 )[(this.pesquisa.periodos.length - 1)].nome);
                }

            });
        });

        if(this.localidades && this.localidades.length > 0) {
            this.mapas = [];
            this.atualizaCartograma();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.localidades && this.localidades.length > 0) {
            this.atualizaCartograma();
        }

        if(this.pesquisa) {
            this.listaPeriodos = this.pesquisa.periodos.map((periodo) => {
                return parseInt(periodo.nome);
            });

            if(this.anoSelecionado) {
                this.indexSelecionado = this.listaPeriodos.findIndex((periodo) => periodo == this.anoSelecionado);
            } else {
                this.indexSelecionado = this.listaPeriodos.length - 1;
            }

        }
    }

    atualizaCartograma() {
        if(this.indicadorSelecionado === undefined || this.indicadorSelecionado.id === undefined) {
            return;
        }

        let mapaLocalidades = [];
        let mapaLocalidadesMarcadas = {};

        (<Localidade[]>this.localidades)
            .map((localidade) => this._localidadeServ.getMunicipioByCodigo(localidade))
            .filter(mun => mun !== undefined)
            .forEach((mun) => {
                if(!mapaLocalidadesMarcadas[mun.parent.codigo]) {
                    mapaLocalidades.push(mun.parent);
                    mapaLocalidadesMarcadas[mun.parent.codigo] = [];
                }
                mapaLocalidadesMarcadas[mun.parent.codigo].push(mun);
            });
        let resultadosCartograma$ = mapaLocalidades.map((localidade) => this._resultadoServ.getResultadosCartograma(this.indicadorSelecionado.id, localidade.codigo));
        
        Observable.zip(...resultadosCartograma$)
            .subscribe(resultados => {
                let mapas = [];

                for(let i=0; i<resultados.length; i++) {
                    mapas.push({
                        localidade: mapaLocalidades[i],
                        localidadesMarcadas: mapaLocalidadesMarcadas[mapaLocalidades[i].codigo],
                        resultados: resultados[i],
                        titulo: mapaLocalidades[i].nome
                    });
                }

                this.mapas = mapas;
            });

        // this.localidades.forEach(localidade => {
        //     let mun = this._localidadeServ.getMunicipioByCodigo(localidade)

        //     if(mun === undefined) {
        //         return;
        //     }

        //     this._resultadoServ.getResultadosCartograma(this.indicadorSelecionado.id, mun.parent.codigo)
        //         .subscribe((resultados) => {
        //             this.mapas.push({
        //                 mun,
        //                 resultados
        //             });
        //         });
        // });
        
    }

    mudaAno(ano){
        this.anoSelecionado = ano;
        this.onAno.emit(ano);
        console.log(ano);
    }
}