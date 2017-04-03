import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Pesquisa} from '../../shared2/pesquisa/pesquisa.model';
import {Localidade} from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';

@Component({
    selector: 'pesquisa-header',
    templateUrl: './pesquisa-header.template.html',
    styleUrls: ['./pesquisa-header.style.css']
})

export class PesquisaHeaderComponent implements OnInit {
    @Input() pesquisa: Pesquisa;
    @Input() localidade: Localidade;

    mostrarNotas = false;
    mostrarOpcoes = false;

    constructor() { }

    ngOnInit() { }

    setaLocalidade1(localidade){
        //setar rota
        console.log(localidade);
    }

    setaLocalidade2(localidade){
        //setar rota
        console.log(localidade);
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
                    {{ localidadeSelecionada ? localidadeSelecionada.nome : "Adicionar comparação" }}
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
    localidadeSelecionada: Localidade;
    @Output() onLocalidade = new EventEmitter();

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
        this.localidadeSelecionada = localidade;
        this.mostrarMenu = false;
        this.onLocalidade.emit(localidade);
    }
}