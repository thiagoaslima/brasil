import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

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

    public mun;

    public resultados;
    public tituloCartograma;

    public listaPeriodos
    public anoSelecionado;

    constructor(
        private _localidadeServ: LocalidadeService2,
        private _resultadoServ: ResultadoService3,
        private _pesquisaService: PesquisaService2,
        private _routerParamsService: RouterParamsService
    ) { }

    ngOnInit() {
        this.mun = this._localidadeServ.getMunicipioByCodigo(this.localidades[0]);

        this.atualizaCartograma();
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.localidades.length > 0) {
            this.mun = this._localidadeServ.getMunicipioByCodigo(this.localidades[0]);
            this.atualizaCartograma();
        }

        if(this.pesquisa) {
            this.listaPeriodos = this.pesquisa.periodos.map((periodo) => {
                return parseInt(periodo.nome);
            });

            this.anoSelecionado = this.listaPeriodos.length - 1;
        }
    }

    atualizaCartograma() {
        if(this.indicadorSelecionado === undefined || this.indicadorSelecionado.id === undefined) {
            return;
        }
        this._resultadoServ.getResultadosCartograma(this.indicadorSelecionado.id, this.mun.parent.codigo)
            .subscribe((resultados) => {
                this.resultados = resultados;
            });
    }

    mudaAno(ano){
        console.log(ano);
    }
}