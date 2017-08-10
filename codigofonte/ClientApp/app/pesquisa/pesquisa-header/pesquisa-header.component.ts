import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'pesquisa-header',
    templateUrl: './pesquisa-header.template.html',
    styleUrls: ['./pesquisa-header.style.css']
})

export class PesquisaHeaderComponent implements OnInit, OnDestroy {

    @Input() mostraAno: boolean;

    @Output() onDownload = new EventEmitter();
    @Output() onOcultarValoresVazios = new EventEmitter();

    pesquisa$: Observable<Pesquisa>;
    pesquisa: Pesquisa;
    localidade: Localidade;
    localidade1: Localidade = null;
    localidade2: Localidade = null;
    ano = 0;
    indicador = 0;
    mostrarNotas = false;
    mostrarOpcoes = false;
    objetoURL: any = {};
    baseURL = '';
    listaPeriodos = [];
    tipo = '';

    isNivelMunicipal;
    isNivelEstadual;
    isNivelNacional;

    private subs$$;
    private isOcultarValoresVazios = true;

    constructor(
        private _pesquisaService: PesquisaService2,
        private _localidadeService: LocalidadeService2,
        private _routerParamsService: RouterParamsService,
        private _route: ActivatedRoute,
        private _router: Router
    ) { }

    ngOnInit() {

        this.subs$$ = this._routerParamsService.params$.subscribe((params) => {
            this._pesquisaService.getPesquisa(params.params.pesquisa).subscribe((pesquisa) => {
                this.pesquisa = pesquisa;
                this.listaPeriodos = pesquisa.periodos.slice(0).reverse();

                if (params.queryParams.ano) {
                    this.ano = params.queryParams.ano;
                }
                else {
                    // Quando não houver um período selecionado, é exibido o período mais recente
                    this.ano = Number(this.pesquisa.periodos.sort((a, b) => a.nome > b.nome ? 1 : -1)[(this.pesquisa.periodos.length - 1)].nome);
                }

                this.isNivelMunicipal = !!params.params.uf && !!params.params.municipio;
                this.isNivelEstadual = !!params.params.uf && !params.params.municipio;
                this.isNivelNacional = !params.params.uf && !params.params.municipio;

                this.indicador = params.params.indicador;
                if (params.params.municipio) {
                    this.localidade = this._localidadeService.getMunicipioBySlug(params.params.uf, params.params.municipio);
                } else if (params.params.uf) {
                    this.localidade = this._localidadeService.getUfBySigla(params.params.uf);
                }

                this.localidade1 = this.obterLocalidade(params.queryParams.localidade1);
                this.localidade2 = this.obterLocalidade(params.queryParams.localidade2);
                this.tipo = params.queryParams.tipo ? params.queryParams.tipo : '';

                this.objetoURL.uf = params.params.uf;
                this.objetoURL.municipio = params.params.municipio;
                this.objetoURL.pesquisa = params.params.pesquisa;
                this.objetoURL.indicador = params.params.indicador ? params.params.indicador : 0;
                this.objetoURL.queryParams = params.queryParams ? params.queryParams : {};
            });
        });
    }

    ngOnDestroy() {
        this.subs$$.unsubscribe();
    }

    navegarPara(indicador = null, ano = null, tipo = null, localidade1 = null, localidade2 = null) {

        this.objetoURL.indicador = indicador ? indicador : this.objetoURL.indicador;

        if (ano)
            this.objetoURL.queryParams.ano = ano;

        if (tipo == '')
            delete this.objetoURL.queryParams.tipo;
        else if (tipo != null)
            this.objetoURL.queryParams.tipo = tipo;

        if (localidade1 == 0)
            delete this.objetoURL.queryParams.localidade1;
        else if (localidade1 != null)
            this.objetoURL.queryParams.localidade1 = localidade1;

        if (localidade2 == 0)
            delete this.objetoURL.queryParams.localidade2;
        else if (localidade2 != null)
            this.objetoURL.queryParams.localidade2 = localidade2;

        let url = [];
        url.push('brasil');
        url.push(this.objetoURL.uf);

        if (!!this.objetoURL.municipio) {

            url.push(this.objetoURL.municipio);
        }

        url.push('pesquisa');
        url.push(this.objetoURL.pesquisa);
        url.push(this.objetoURL.indicador);

        this._router.navigate(url, { 'queryParams': this.objetoURL.queryParams });
    }

    setaLocalidade1(localidade) {

        this.navegarPara(null, null, null, localidade ? localidade.codigo : 0);
    }

    setaLocalidade2(localidade) {

        this.navegarPara(null, null, null, null, localidade ? localidade.codigo : 0);
    }

    mudaIndicador(event) {
        this.navegarPara(event.srcElement.value);
    }

    mudaAno(event) {

        this.navegarPara(null, event.srcElement.value.trim());
    }

    // setaTipo(tipo) {

    //     if (this.isNivelEstadual || this.isNivelNacional || (this.isNivelMunicipal && tipo == 'grafico' && this.listaPeriodos.length <= 1)) {
    //         return;
    //     }

    setaTipo(tipo){

        if(this.isNivelNacional){
            return;
        }
        
        if(this.isNivelEstadual && tipo == 'grafico' && this.listaPeriodos.length <= 1){
            return;
        }
        
        if(this.isNivelMunicipal && tipo == 'grafico' && this.listaPeriodos.length <= 1){
            return
        }
        
        this.navegarPara(null, null, tipo);
    }

    fazerDownload() {
        this.mostrarOpcoes = false;
        this.onDownload.emit();
    }

    ocultarValoresVazios() {

        this.isOcultarValoresVazios = !this.isOcultarValoresVazios;
        this.onOcultarValoresVazios.emit({ "OcultarValoresVazios": this.isOcultarValoresVazios });
    }

    compartilhar() {
        this.mostrarOpcoes = false; //esconde o menu
    }

    private obterLocalidade(codigoLocalidade: string): Localidade {

        if (!codigoLocalidade) {

            return null;
        }

        if (codigoLocalidade.length == 2) {

            return this._localidadeService.getUfByCodigo(Number(codigoLocalidade))
        }

        return this._localidadeService.getMunicipioByCodigo(codigoLocalidade);
    }
}