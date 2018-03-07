import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

import {
    Localidade,
    Pesquisa,
    PesquisaService3,
    IndicadorService3,
    RouterParamsService
} from '../../shared';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

@Component({
    selector: 'submenu',
    templateUrl: 'submenu.template.html',
    styleUrls: ['submenu.style.css']
})
export class SubmenuComponent implements OnInit, OnDestroy, OnChanges {

    public pesquisas = <Pesquisa[]>[];
    public idPesquisaSelecionada;
    public idPesquisaSubmenu;
    public indicadores = [];
    public idIndicadorSelecionado;
    public codigoMunicipio;
    public baseURL;
    public codigoCapital = 0;

    @Output() closeMenu = new EventEmitter();
    @Input() localidade: Localidade;

    constructor(
        private _routerParams: RouterParamsService,
        private router: Router,
        private _pesquisaService: PesquisaService3,
        private _indicadorService: IndicadorService3,
    ) {

        // pega a rota atual
        this._routerParams.params$.subscribe(({ params }) => {
            // pega o indicador e a pesquisa a partir da rota
            this.idPesquisaSelecionada = params.pesquisa;
            this.idIndicadorSelecionado = params.indicador;
        });

    }

    ngOnInit() {

    }

    ngOnDestroy() {
        // this.allPesquisas$$.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.localidade && changes.localidade.currentValue) {
            this._pesquisaService.
                getPesquisasPorAbrangenciaTerritorial(this.localidade.tipo)
                .subscribe(pesquisas => {
                    this.pesquisas = pesquisas.sort((a,b) => {
                        return a.nome.localeCompare(b.nome);
                    });
                });

            if (this.localidade.tipo === 'municipio' && this.localidade.codigo !== this.localidade.parent.codigoCapital) {
                this.codigoCapital = this.localidade.parent.codigoCapital;
            } else {
                this.codigoCapital = 0;
            }

        }
    }

    onClick(index) {
        const pesquisa = this.pesquisas[index];
        this.idPesquisaSubmenu = pesquisa.id;

        if (pesquisa.id === 23) {
            // CENSO
            this._indicadorService.getIndicadoresDaPesquisa(pesquisa.id)
                .subscribe(indicadores => {
                    indicadores = indicadores.slice().sort((a, b) => a.nome > b.nome ? 1 : -1);
                    const sinopseIndex = indicadores.findIndex(indicador => indicador.nome.toLowerCase() === 'sinopse');
                    const sinopse = indicadores.splice(sinopseIndex, 1);
                    this.indicadores = sinopse.concat(indicadores);
                });
        } else {

            // Caso seja a pequisa cujos indicadores variam ccom o ano, é necessário informar um período para obter os indicadores, pois os indicadores variam por período.
            let periodoMaisrecente = undefined;
            if ( this._pesquisaService.isPesquisaComIndicadoresQueVariamComAno(pesquisa.id) ) {

                periodoMaisrecente = pesquisa.periodos.sort( (periodoA, periodoB) => periodoA.nome < periodoB.nome ? 1 : -1)[0].nome;
            }
            
            this._indicadorService
                .getIndicadoresDaPesquisaByPeriodo(pesquisa.id, periodoMaisrecente)
                .take(1)
                .subscribe(indicadores => {
    
                    // if (indicadores.length === 1 || pesquisa.id !== 23) { //pesquisa 23 é o censo
                    this.router.navigate([this.localidade.link + '/pesquisa/' + this.pesquisas[index].id + '/' + indicadores[0].id]);
                    this.closeMenu.emit();
                    // }
                });
        }



    }

}