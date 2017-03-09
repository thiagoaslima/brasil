import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RouterParamsService } from '../../shared/router-params.service';
import { Subscription } from 'rxjs';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { CommonService } from '../../shared/common.service';

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
export class SinteseHeaderComponent implements OnInit {

 
    // Nome do indicador
    public titulo;
    // Nome da pesquisa de origem
    public pesquisa;
    // Código da pesquisa de origem
    public codPesquisa;
    public dataURL;
    public isMenuOculto = true;
    public queryParams = {};
    // String do link para a pesquisa de origem
    public linkPesquisa;

    // Valores do indicador a serem exportados como arquivo
    private valoresIndicador;
    private _subscriptionSintese: Subscription;
    private _link = [];

    // Indica qual o componente está ativo. Pode ser 'grafico' ou 'mapa'.
    @Input() ativo = 'cartograma';
    @Input() infoIndicador: string[];
    @Input() graficoBase64;
    @Output() visualizacaoAlterada = new EventEmitter();


    constructor(
        private _routerParams:RouterParamsService,
        private _sinteseService:SinteseService, 
        private _commonService: CommonService,
        private _localidade:LocalidadeService,
        private _router: Router,
        private _route: ActivatedRoute
    ){ }


    ngOnInit(){

        this._subscriptionSintese = this._routerParams.params$.subscribe(({params}) => {
            if (params.indicador) {
                this._link = ['brasil', params.uf, params.municipio, 'sintese', params.indicador];

                // Informações gerais do município
                let dadosMunicipio = this._localidade.getMunicipioBySlug(params.uf, params.municipio);

                // O código do município deve possuir somente 6 dígitos, sendo o último desprezado
                let codigoMunicipio = dadosMunicipio.codigo.toString().substr(0, 6);

                if (params.indicador !== 'historico') {
                    // Obtém as informações sobre a pesquisa, dado seu indicador
                    this._sinteseService.getPesquisaByIndicador(params.indicador)
                        .retry(3)
                        .flatMap(pesquisa => {

                            //obtém o nome da pesquisa de origem do indicador
                            this.pesquisa = pesquisa.descricao;

                            //obtém o código da pesquida
                            this.codPesquisa = pesquisa.id;

                            return this._sinteseService.getPesquisa(pesquisa.id, codigoMunicipio, [params.indicador])
                        })
                        .subscribe((dados) => {

                            //descrição textual do indicador presente na rota
                            this.titulo = dados[0].indicador;

                            //constrói link para pesquisa de origem
                            this.linkPesquisa = '/brasil/' + params.uf + '/' + params.municipio + '/pesquisas/' + this.codPesquisa + '/' + params.indicador;

                            // Valores utilizados na exportação de arquivo
                            this.valoresIndicador = this.substituirVirgulasPorPontosNosValoresDoObjeto(dados[0].res);

                            debugger;

                            this.valoresIndicador['Fontes'] = this.getFontesIndicador();

                        });
                }
            }

        });
        
        //verifica se o componente de detalhes está aberto (mobile)
        this._route.queryParams.subscribe(params => {
            //copia os parâmetros
            this.queryParams = {};
            for(let key in params){
                this.queryParams[key] = params[key];
            }
            //seta o parâmetro de detalhes para false
            this.queryParams['detalhes'] = 'false';
            
            //seta a view ativa
            if(params['v'] == 'mapa'){

                this.ativo = 'cartograma';

            } else if(params['v'] == 'grafico') {

                this.ativo = 'grafico';

            } else {

                this.ativo = 'historico';

            } 
        });

        this._commonService.notifyObservable$.subscribe((mensagem) => {

            if(mensagem['tipo'] == 'dataURL'){

                this.graficoBase64 = mensagem['url'];
            }
        });

    }

    public ativar(tipo){
        this.ativo = tipo;
        this.visualizacaoAlterada.emit(tipo);

        if(tipo == 'cartograma'){
            this._router.navigate(this._link, {queryParams: { 'v' : 'mapa', 'detalhes' : 'true' }});
        } else {
            this._router.navigate(this._link, {queryParams: { 'detalhes' : 'true' }});
        }        
    }

    public downloadImagem(){

        this._commonService.notifyOther({"tipo": "getDataUrl"});
    }

    /**
     * Exibe o diálogo de download para salvar um arquivo CSV.
     * 
     * @conteudo:string - conteúdo a ser salvo.
     */
    public downloadCSV(){

        const defaults = {
                            "DELIMITER" : {
                            "FIELD" : ",",
                            "ARRAY" : ";",
                            "WRAP"  : "",
                            "EOL"   : "\n"
                            },
                            "PREPEND_HEADER" : true,
                            "TRIM_HEADER_FIELDS": false,
                            "TRIM_FIELD_VALUES" : false,
                            "SORT_HEADER" : false,
                            "PARSE_CSV_NUMBERS" : false,
                            "KEYS" : null,
                            "CHECK_SCHEMA_DIFFERENCES": true,
                            "EMPTY_FIELD_VALUE": "null"
                        };

        converter.json2csv(this.valoresIndicador, (erro, csv) => {

            if(!erro){

                this.save(csv, 'text/csv');
            }
        }, defaults);
    }

    public abrirMenu(){

        this.isMenuOculto = false;
    }

    public fecharMenu(){

        this.isMenuOculto = true;
    }

    private getFontesIndicador(): string{

        debugger;

        let fontes: string = '';

        if(!this.infoIndicador || this.infoIndicador.length == 0){

            fontes = 'Não Informado';
        }
        else {

            this.infoIndicador.map(info => fontes =  fontes + 'Ano Referência: ' + info['periodo'] + ' - Fonte: ' + info['fonte'] + '| ');
        }
       

        return fontes.replace(', | ;', '');
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