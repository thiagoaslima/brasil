import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router'

import { Pesquisa } from '../shared2/pesquisa/pesquisa.model';
import { PesquisaService2 } from '../shared2/pesquisa/pesquisa.service';
import { RouterParamsService } from '../shared/router-params.service';
import { slugify } from '../utils/slug';

import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'submenu',
    templateUrl: 'submenu.template.html',
    styleUrls: ['submenu.style.css']
})
export class SubmenuComponent implements OnInit, OnDestroy {

    public pesquisas = <Pesquisa[]>[];
    public idPesquisaSelecionada;
    public idPesquisaSubmenu;
    public indicadores = [];
    public idIndicadorSelecionado;
    public codigoMunicipio;
    public baseURL;
    public codigoCapital = 0;

    private allPesquisas$$: Subscription

    @Output() closeMenu = new EventEmitter();
    @Input() localidade;

    constructor(
        private _routerParams: RouterParamsService,
        private router: Router,
        private _pesquisaService: PesquisaService2
    ) { }

    ngOnInit() {

        //busca pesquisas disponíveis e as organiza em ordem alfabética
        this.allPesquisas$$ = this._pesquisaService.getAllPesquisas()
            .map(pesquisas => pesquisas.sort((a, b) => slugify(a.nome) < slugify(b.nome) ? -1 : 1))
            .subscribe(pesquisas => this.pesquisas = pesquisas);

        //pega a rota atual
        this._routerParams.params$.subscribe(({ params }) => {
            //pega o indicador e a pesquisa a partir da rota
            this.idPesquisaSelecionada = params.pesquisa;
            this.idIndicadorSelecionado = params.indicador;
        });

        if(this.localidade.tipo == 'municipio' && this.localidade.codigo != this.localidade.parent.codigoCapital)
            this.codigoCapital = this.localidade.parent.codigoCapital;
        else
            this.codigoCapital = 0;
    }

    ngOnDestroy() {
        this.allPesquisas$$.unsubscribe();
    }

    onClick(index) {
        const pesquisa = this.pesquisas[index];
        this.idPesquisaSubmenu = pesquisa.id;

        pesquisa.indicadores.take(1).subscribe(indicadores => {
            if (indicadores.length === 1) {
                this.router.navigate([this.localidade.link + '/pesquisa/' + this.pesquisas[index].id + '/' + indicadores[0].id], { queryParams: {detalhes: true,  localidade1: this.codigoCapital} });
                this.closeMenu.emit();
            }
        });
       
    }

}