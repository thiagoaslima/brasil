import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { LinhaTempo } from '../../infografia/linha-tempo/linha-tempo.component';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb.component';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { ResultadoService3 } from '../../shared3/services/resultado.service';

@Component({
    selector: 'pesquisa-cartograma',
    templateUrl: './pesquisa-cartograma.template.html',
    styleUrls: ['./pesquisa-cartograma.style.css']
})

export class PesquisaCartogramaComponent implements OnInit, OnChanges {

    @Input() localidades;
    @Input() indicador;

    public mun;

    public resultados;
    public tituloCartograma;

    constructor(
        private _localidadeServ: LocalidadeService2,
        private _resultadoServ: ResultadoService3
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
    }

    atualizaCartograma() {
        if(this.indicador === undefined || this.indicador.id === undefined) {
            return;
        }
        this._resultadoServ.getResultadosCartograma(this.indicador.id, this.mun.parent.codigo)
            .subscribe((resultados) => {
                this.resultados = resultados;
            });
    }

    mudaAno(ano){
        console.log(ano);
    }
}