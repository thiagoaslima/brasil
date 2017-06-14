import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Pesquisa} from '../../shared2/pesquisa/pesquisa.model';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { Localidade} from '../../shared2/localidade/localidade.model';
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
    objetoURL:any = {};
    baseURL = '';
    listaPeriodos = [];
    tipo = '';

    private subs$$;
    private isOcultarValoresVazios = true;

    constructor(
        private _pesquisaService: PesquisaService2,
        private _localidadeService: LocalidadeService2,
        private _routerParamsService: RouterParamsService,
        private _route: ActivatedRoute,
        private _router: Router
    ) { }

    ngOnInit(){
        this.subs$$ = this._routerParamsService.params$.subscribe((params) => {
            this._pesquisaService.getPesquisa(params.params.pesquisa).subscribe((pesquisa) => {
                this.pesquisa = pesquisa;
                this.listaPeriodos = pesquisa.periodos.slice(0).reverse();

                if(params.queryParams.ano){
                    this.ano = params.queryParams.ano;
                }
                else {
                    // Quando não houver um período selecionado, é exibido o período mais recente
                    this.ano = Number(this.pesquisa.periodos.sort((a, b) =>  a.nome > b.nome ? 1 : -1 )[(this.pesquisa.periodos.length - 1)].nome);
                }

                this.indicador = params.params.indicador;
                this.localidade = this._localidadeService.getMunicipioBySlug(params.params.uf, params.params.municipio);
                this.localidade1 = params.queryParams.localidade1 ? this._localidadeService.getMunicipioByCodigo(params.queryParams.localidade1) : null;
                this.localidade2 = params.queryParams.localidade2 ? this._localidadeService.getMunicipioByCodigo(params.queryParams.localidade2) : null;
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

    navegarPara(indicador = null, ano = null, tipo = null, localidade1 = null, localidade2 = null){
        this.objetoURL.indicador = indicador ? indicador : this.objetoURL.indicador;

        if(ano)
            this.objetoURL.queryParams.ano = ano;
        
        if(tipo == '')
            delete this.objetoURL.queryParams.tipo;
        else if(tipo != null)
            this.objetoURL.queryParams.tipo = tipo;
        
        if(localidade1 == 0)
            delete this.objetoURL.queryParams.localidade1;
        else if(localidade1 != null)
            this.objetoURL.queryParams.localidade1 = localidade1;
        
        if(localidade2 == 0)
            delete this.objetoURL.queryParams.localidade2;
        else if(localidade2 != null)
            this.objetoURL.queryParams.localidade2 = localidade2;
        
        let url = ['brasil', this.objetoURL.uf, this.objetoURL.municipio, 'pesquisa', this.objetoURL.pesquisa, this.objetoURL.indicador];
        this._router.navigate(url, {'queryParams' : this.objetoURL.queryParams});
    }

    setaLocalidade1(localidade){
        this.navegarPara(null, null, null, localidade ? localidade.codigo : 0);
    }

    setaLocalidade2(localidade){
        this.navegarPara(null, null, null, null, localidade ? localidade.codigo : 0);
    }

    mudaIndicador(event){
        this.navegarPara(event.srcElement.value);
    }

    mudaAno(event){
        this.navegarPara(null, event.srcElement.value.trim());
    }

    setaTipo(tipo){
        if(tipo == 'grafico' && this.listaPeriodos.length <= 1)
            return;
        this.navegarPara(null, null, tipo);
    }

    fazerDownload(){
        this.mostrarOpcoes = false;
        this.onDownload.emit();
    }

    ocultarValoresVazios(){

        this.isOcultarValoresVazios = !this.isOcultarValoresVazios;
        this.onOcultarValoresVazios.emit({"OcultarValoresVazios": this.isOcultarValoresVazios});
    }

    compartilhar(){
        this.mostrarOpcoes = false; //esconde o menu
    }
}

/***********************
   componente do cabeçalho com busca de localidade
************************/

@Component({
    selector: 'busca-header',
    template: `
        <div class="cabecalho__visualizacao-dados__item compara-blank">
            <div class="area-click" [class.area-click--visivel]="mostrarMenu" (click)="mostrarMenu = false;"></div>
            <div class="add-municipio" [class.submenu-aberto]="mostrarMenu">
                <button (click)="mostrarMenu = true">
                    {{ localidadeAtual ? localidadeAtual.nome : "Adicionar comparação" }}
                    <i class="fa" [class.fa-caret-down]="!mostrarMenu" [class.fa-caret-up]="mostrarMenu" aria-hidden="true"></i>
                </button>
                <div class="por-estado__selecionar-municipio">
                    <!--div class="estado-selecionado">
                        <span class="selecionado">Município</span><span>Estado</span><span>Brasil</span>
                    </div-->
                    <div class="botao_remove" *ngIf="localidadeAtual" (click)="onClickItem(null)">
                        <i class="fa fa-times" aria-hidden="true"></i> {{ localidadeAtual.nome }}
                    </div>
                    <input placeholder="Qual município você procura?" type="text" (input)="onChangeInput($event)">
                    <div id="todos-municipios">
                        <ul>
                            <li *ngFor="let localidade of localidades" (click)="onClickItem(localidade)">
                                <p> {{ localidade.nome }} <span> {{ localidade.parent.sigla }} </span></p>
                            </li>
                        </ul>
                        <div *ngIf="localidades == null">
                            <p class="todos-municipios__titulo">Mais acessados:</p>
                            <ul>
                                <li *ngFor="let localidade of capitais" (click)="onClickItem(localidade)">
                                    <p> {{ localidade.nome }} <span> {{ localidade.parent.sigla }} </span></p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./pesquisa-header.style.css']
})

export class BuscaHeaderComponent{
    mostrarMenu = false;
    localidades: Localidade[];
    capitais: Localidade[];
    @Output() onLocalidade = new EventEmitter();
    @Input() localidadeAtual: Localidade;

    constructor(
        private _localidadeService: LocalidadeService2
    ) { }

     ngOnInit(){
         this.capitais = this._localidadeService.getAllCapitais();
    }

    onChangeInput(event){
        let texto = event.srcElement.value;
        if(texto.length >= 3){
            this.localidades = this._localidadeService.buscar(texto)
                .filter((item) => {return item.tipo == 'municipio';});
        }else{
            this.localidades = null;
        }
    }

    onClickItem(localidade: Localidade){
        this.mostrarMenu = false;
        this.onLocalidade.emit(localidade);
    }
}