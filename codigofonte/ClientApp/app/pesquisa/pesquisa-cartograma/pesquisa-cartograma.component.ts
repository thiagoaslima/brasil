import { TraducaoService } from '../../traducao/traducao.service';
import { IndicadorService3, LocalidadeService3 } from '../../shared3/services';
import { Observable } from 'rxjs/Rx';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { isNode } from 'angular2-universal';
import { Observable } from 'rxjs/Rx';

import { LinhaTempo } from '../../infografia/linha-tempo/linha-tempo.component';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb.component';
import { ResultadoService3 } from '../../shared3/services/resultado.service';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';
import { IndicadorService3, LocalidadeService3 } from '../../shared3/services';


@Component({
    selector: 'pesquisa-cartograma',
    templateUrl: './pesquisa-cartograma.template.html',
    styleUrls: ['./pesquisa-cartograma.style.css']
})

export class PesquisaCartogramaComponent implements OnChanges {

    @Input() localidades;
    @Input() indicadores;
    @Input() indicadorSelecionado;
    @Input() pesquisa;
    @Input() periodo: string;
    @Input() breadcrumb;

    @Output() onAno = new EventEmitter;

    public indicador;
    public mapas: {mun, resultados, localidade, localidadesMarcadas}[] = [];
    public mun;
    public resultados;
    public tituloCartograma;
    public listaPeriodos;

    public isBrowser = isBrowser;
    public isNode = isNode;

    public vazio = false;

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _localidadeServ: LocalidadeService3,
        private _resultadoServ: ResultadoService3,
        private _pesquisaService: PesquisaService2,
        private _indicadorServ: IndicadorService3,
        private _routerParamsService: RouterParamsService,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if(this.pesquisa && this.localidades && this.localidades.length > 0) {
            this.listaPeriodos = this.pesquisa.periodos.map((periodo) => {
                return periodo.nome;
            });
            this.atualizaCartograma();
        }
    }

    atualizaCartograma() {
        if(this.indicadorSelecionado === undefined) {
            return;
        }

        let mapaLocalidades = [];
        let mapaLocalidadesMarcadas = {};

        this._indicadorServ.getIndicadoresById([this.indicadorSelecionado])
            .subscribe((indicadores) => {
                this.indicador = indicadores[0];
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
            });

        (<any[]>this.localidades)
            .filter(localidade => localidade !== undefined)
            .map((localidade) => this._localidadeServ.getByCodigo(localidade)[0])
            .forEach((mun) => {
                if(mun.parent.codigo === 53) { return; }
                if(!mapaLocalidadesMarcadas[mun.parent.codigo]) {
                    mapaLocalidades.push(mun.parent);
                    mapaLocalidadesMarcadas[mun.parent.codigo] = [];
                }
                mapaLocalidadesMarcadas[mun.parent.codigo].push(mun);
            });
        let resultadosCartograma$ = mapaLocalidades.map((localidade) => this._resultadoServ.getResultadosCartograma(this.indicadorSelecionado, localidade.codigo));
        
        Observable.zip(...resultadosCartograma$)
            .subscribe(resultados => {
                //verifica se o resultado é vazio
                this.vazio = true;
                for(let item in resultados[0]){
                    this.vazio = false;
                    break;
                }
                //---------
                let mapas = [];
                for(let i=0; i<resultados.length; i++) {
                    mapas.push({
                        localidade: mapaLocalidades[i],
                        localidadesMarcadas: mapaLocalidadesMarcadas[mapaLocalidades[i].codigo],
                        resultados: resultados[i],
                        titulo: this.indicador && this.indicador.nome
                    });
                }
                this.mapas = mapas;
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
            });

        // this.localidades.forEach(localidade => {
        //     let mun = this._localidadeServ.getMunicipioByCodigo(localidade)

        //     if(mun === undefined) {
        //         return;
        //     }

        //     this._resultadoServ.getResultadosCartograma(this.indicadorSelecionado, mun.parent.codigo)
        //         .subscribe((resultados) => {
        //             this.mapas.push({
        //                 mun,
        //                 resultados
        //             });
        //         });
        // });
        
    }

    public getPreposicaoUF(nomeUf: string): string{

        return this._localidadeServ.getPreprosisaoTituloUF(nomeUf);
    }

    mudaAno(ano){
        this.onAno.emit(ano);
    }
}