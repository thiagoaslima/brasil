import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

import { Localidade } from '../shared2/localidade/localidade.model';
import { Pesquisa } from '../shared2/pesquisa/pesquisa.model';
import { PesquisaService2 } from '../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../shared/router-params.service';

import { Subscription } from 'rxjs/Subscription';
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
        private _pesquisaService: PesquisaService2
    ) { }

    ngOnInit() {

        // pega a rota atual
        this._routerParams.params$.subscribe(({ params }) => {
            // pega o indicador e a pesquisa a partir da rota
            this.idPesquisaSelecionada = params.pesquisa;
            this.idIndicadorSelecionado = params.indicador;
        });

    }

    ngOnDestroy() {
        // this.allPesquisas$$.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.localidade && changes.localidade.currentValue) {
            this._pesquisaService.getAllPesquisasPorTipoLocalidade(this.localidade.tipo)
                .toPromise()
                .then(pesquisas => this.pesquisas = pesquisas);

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
            pesquisa.getIndicadores().toPromise().then(indicadores => {
                indicadores = indicadores.slice().sort((a, b) => a.nome > b.nome ? 1 : -1);
                const sinopseIndex = indicadores.findIndex(indicador => indicador.nome.toLowerCase() === 'sinopse');
                const sinopse = indicadores.splice(sinopseIndex, 1);
                this.indicadores = sinopse.concat(indicadores);
            });
        } else {

            // Caso seja a pequisa MUNIC, é necessário informar um período para obter os indicadores, pois os indicadores variam por período.
            let periodoMaisrecente = null;
            if (pesquisa.id === 1) {

                periodoMaisrecente = pesquisa.periodos.sort( (periodoA, periodoB) => periodoA.nome < periodoB.nome ? 1 : -1)[0];
            }

            pesquisa.getIndicadores(periodoMaisrecente.nome).take(1).subscribe(indicadores => {

                // if (indicadores.length === 1 || pesquisa.id !== 23) { //pesquisa 23 é o censo
                this.router.navigate([this.localidade.link + '/pesquisa/' + this.pesquisas[index].id + '/' + indicadores[0].id]);
                this.closeMenu.emit();
                // }
            });
        }



    }

}