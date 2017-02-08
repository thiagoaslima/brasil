import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RouterParamsService } from '../../shared/router-params.service';
import { Subscription } from 'rxjs';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
var FileSaver = require('file-saver');

// Biblioteca usada a convesação de JSON para CSV.
var converter = require('json-2-csv');


@Component({
    selector: 'sintese-header',
    templateUrl: 'sintese-header.template.html',
    styleUrls: ['sintese-header.style.css'],
})
export class SinteseHeaderComponent implements OnChanges {

    // Indica qual o componente está ativo. Pode ser 'grafico' ou 'mapa'.
    public ativo = 'cartograma'; 
    // Nome do indicador
    public titulo;
    // Nome da pesquisa de origem
    public pesquisa;
    // Código da pesquisa de origem
    //public codPesquisa;
    public dataURL;
    public isMenuOculto = true;

    // Valores do indicador a serem exportados como arquivo
    private valoresIndicador;
    private _subscriptionSintese: Subscription;
    private _link = [];

    @Input() graficoBase64;
    @Output() visualizacaoAlterada = new EventEmitter();


    constructor(
        private _routerParams:RouterParamsService,
        private _sinteseService:SinteseService, 
        private _localidade:LocalidadeService,
        private _router: Router,
    ){ }


    ngOnChanges(){

        this._subscriptionSintese = this._routerParams.params$.subscribe((params)=>{


            if(params.indicador){

                this._link = ['brasil', params.uf, params.municipio, 'sintese', params.indicador]; 

                // Informações gerais do município
                let dadosMunicipio = this._localidade.getMunicipioBySlug(params.uf, params.municipio);

                // O código do município deve possuir somente 6 dígitos, sendo o último desprezado
                let codigoMunicipio = dadosMunicipio.codigo.toString().substr(0, 6);

                // Obtém as informações sobre a pesquisa, dado seu indicador
                let dadosPesquisa = this._sinteseService.getPesquisaByIndicadorDaSinteseMunicipal(params.indicador);

                // Recupera os valores da pesquisa
                this._sinteseService.getPesquisa(dadosPesquisa.codigo, codigoMunicipio, [params.indicador]).subscribe((dados) => {

                    //descrição textual do indicador presente na rota
                    this.titulo = dados[0].indicador; 

                    //obtém o nome da pesquisa de origem do indicador
                    this.pesquisa = dadosPesquisa.nome; 

                    //obtém o código da pesquida
                    //this.codPesquisa = dadosPesquisa.codigo; 

                    // Valores utilizados na exportação de arquivo
                    this.valoresIndicador = this.substituirVirgulasPorPontosNosValoresDoObjeto(dados[0].res);
                });
            }
        });

    }

    public ativar(tipo){

        this.ativo = tipo;
        this.visualizacaoAlterada.emit(tipo);

        if(tipo == 'cartograma'){

            this._router.navigateByUrl(this._router.url + '/mapa');
            

        } else {

            this._router.navigate(this._link);
        }        
    }

    public downloadImagem(){

        // TODO: emitir evento
        // this._commonService.notifyOther({"tipo": "obterImagem"});
    }

    /**
     * Exibe o diálogo de download para salvar um arquivo CSV.
     * 
     * @conteudo:string - conteúdo a ser salvo.
     */
    public downloadCSV(){

        converter.json2csv(this.valoresIndicador, (erro, csv) => {

            if(!erro){

                  this.save(csv, 'text/csv');
            }
        });
    }

    public abrirMenu(){

        this.isMenuOculto = false;
    }

    public fecharMenu(){

        this.isMenuOculto = true;
    }

    /**
     * Exibe o diálogo de download para o usuário salvar arquivo.
     * 
     * @conteudo:string - conteúdo a ser salvo.
     * @tipo:string - mime type do arquivo a ser salvo.
     */
    private save(conteudo, tipo) {

        let extensao = tipo == 'image/jpeg' ? '.jpeg' : '.csv';

        let blob = new Blob([conteudo], { type: tipo });

        FileSaver.saveAs(blob, this.titulo + extensao);
    }

    /**
     * Substitui os valores de um objeto que possuam vírgula por ponto.
     * 
     * @objeto:Object - o objeto a ter os valores substituídos.
     * 
     * @returns objeto sem vígula nos valores de seus atributos.
     */
    private substituirVirgulasPorPontosNosValoresDoObjeto(objeto){

        if(!objeto){
            
            return;
        }

        let novoObjeto = this.copiarObjeto(objeto);

        for (let k in objeto) {

            if(!novoObjeto[k]){
                
                continue;
            }

            novoObjeto[k] = novoObjeto[k].replace(',', '.');
        }

        return novoObjeto;
    }

    /**
     * Clona um dado objeto.
     * 
     * @objeto:Object - objeto a ser copiado.
     * 
     * @returns o objeto copiado.
     */
    private copiarObjeto(objeto){

        return JSON.parse(JSON.stringify(objeto));
    }

}