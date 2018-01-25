import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { LinhaTempo } from '../../../infografia/linha-tempo/linha-tempo.component';

import {
    TraducaoService,
    Breadcrumb,
    ResultadoService3,
    PesquisaService3,
    RouterParamsService,
    IndicadorService3, LocalidadeService3
} from '../../../shared';

import { ModalErrorService } from '../../../core';


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

    public isBrowser;

    public vazio = false;

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _localidadeServ: LocalidadeService3,
        private _resultadoServ: ResultadoService3,
        private _pesquisaService: PesquisaService3,
        private _indicadorServ: IndicadorService3,
        private _routerParamsService: RouterParamsService,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService,
        @Inject(PLATFORM_ID) platformId,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnChanges(changes: SimpleChanges) {

        // Atualiza o cartograma caso exista uma mudança no período selecionado.
        if(!!changes['periodo']){
           return;
        }

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

    }

    public getPreposicaoUF(nomeUf: string): string{
        return this._localidadeServ.getPreprosicaoTituloUF(nomeUf);
    }

    mudaAno(ano){
        this.onAno.emit(ano);
    }
}