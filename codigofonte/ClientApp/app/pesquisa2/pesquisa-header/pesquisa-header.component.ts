import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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

export class PesquisaHeaderComponent implements OnInit {
    pesquisa$: Observable<Pesquisa>;
    pesquisa: Pesquisa;
    localidade: Localidade;
    localidade1: Localidade = null;
    localidade2: Localidade = null;
    ano = -1;
    indicador = 0;
    mostrarNotas = false;
    mostrarOpcoes = false;
    objetoURL:any = {};
    baseURL = '';

    constructor(
        private _pesquisaService: PesquisaService2,
        private _localidadeService: LocalidadeService2,
        private _routerParamsService: RouterParamsService,
        private _route: ActivatedRoute,
        private _router: Router
    ) { }

    ngOnInit(){
        this._routerParamsService.params$.subscribe((params) => {
            this._pesquisaService.getPesquisa(params.params.pesquisa).subscribe((pesquisa) => {
                this.pesquisa = pesquisa;
            });

            this.ano = (params.queryParams && params.queryParams.ano) ? params.queryParams.ano : -1;
            this.indicador = params.params.indicador;
            this.localidade = this._localidadeService.getMunicipioBySlug(params.params.uf, params.params.municipio);
            if(params.queryParams.localidade1)
                this.localidade1 = this._localidadeService.getMunicipioByCodigo(params.queryParams.localidade1);
            if(params.queryParams.localidade2)
                this.localidade2 = this._localidadeService.getMunicipioByCodigo(params.queryParams.localidade2)

            this.objetoURL.uf = params.params.uf;
            this.objetoURL.municipio = params.params.municipio;
            this.objetoURL.pesquisa = params.params.pesquisa;
            this.objetoURL.indicador = params.params.indicador ? params.params.indicador : 0;
            this.objetoURL.ano = params.queryParams.ano ? params.queryParams.ano : -1;
            this.objetoURL.localidade1 = params.queryParams.localidade1 ? params.queryParams.localidade1 : 0;
            this.objetoURL.localidade2 = params.queryParams.localidade2 ? params.queryParams.localidade2 : 0;
        });
    }

    navegarPara(indicador = null, ano = null, localidade1 = null, localidade2 = null){
        this.objetoURL.indicador = indicador ? indicador : this.objetoURL.indicador;
        this.objetoURL.ano = ano ? ano : this.objetoURL.ano;
        this.objetoURL.localidade1 = localidade1 ? localidade1 : this.objetoURL.localidade1;
        this.objetoURL.localidade2 = localidade2 ? localidade2 : this.objetoURL.localidade2;
        let url = ['brasil', this.objetoURL.uf, this.objetoURL.municipio, 'pesquisa2', this.objetoURL.pesquisa, this.objetoURL.indicador];
        let queryParams = {
            'ano' : this.objetoURL.ano,
            'localidade1' : this.objetoURL.localidade1,
            'localidade2' : this.objetoURL.localidade2
        };
        this._router.navigate(url, {'queryParams' : queryParams});
    }

    setaLocalidade1(localidade){
        //setar rota
        this.navegarPara(null, null, localidade.codigo);
    }

    setaLocalidade2(localidade){
        //setar rota
        this.navegarPara(null, null, null, localidade.codigo);
    }

    mudaIndicador(event){
        this.navegarPara(event.srcElement.value);
    }

    mudaAno(event){
        this.navegarPara(null, event.srcElement.value);
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
                    <input placeholder="Qual município você procura?" type="text" (input)="onChangeInput($event)">
                    <div id="todos-municipios">
                        <!--p class="todos-municipios__titulo">Mais acessados:</p-->
                        <ul>
                            <li *ngFor="let localidade of localidades" (click)="onClickItem(localidade)">
                                <p> {{ localidade.nome }} <span> {{ localidade.parent.sigla }} </span></p>
                            </li>
                        </ul>
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
    @Output() onLocalidade = new EventEmitter();
    @Input() localidadeAtual: Localidade;

    constructor(
        private _localidadeService: LocalidadeService2
    ) { }

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