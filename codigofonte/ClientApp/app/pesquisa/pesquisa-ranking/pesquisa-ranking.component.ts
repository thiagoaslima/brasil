import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs/Rx';

import { RouterParamsService } from '../../shared/router-params.service';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { PesquisaService2 } from '../../shared2/pesquisa/pesquisa.service';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { ItemRanking, RankingLocalidade } from './ranking.model';


@Component({
    selector: 'pesquisa-ranking',
    templateUrl: './pesquisa-ranking.template.html',
    styleUrls: ['./pesquisa-ranking.style.css']
})
export class PesquisaRankingComponent implements OnInit, OnChanges {

    @Input() localidades;
    @Input() indicadores;
    @Input() indicadorSelecionado;
    @Input() pesquisa;

    @Output() onAno = new EventEmitter;


    public rankings;

    public listaPeriodos
    public indexSelecionado;
    public anoSelecionado;


    constructor(
        private _routerParams:RouterParamsService,
        private _activatedRoute: ActivatedRoute,
        private _indicadorService: IndicadorService2,
        private _localidadeService: LocalidadeService2,
        private _pesquisaService: PesquisaService2
    ) { }

    ngOnInit() {

        this._carregarRanking(this._activatedRoute.snapshot);
    }

    ngOnChanges(){

        this._carregarRanking(this._activatedRoute.snapshot);
    }

    private _carregarRanking(params){

        this._pesquisaService.getPesquisa(params.params['pesquisa'])
            .map((pesquisa) => {

                // Pesquisa que possui o indicador avaliado
                this.pesquisa = pesquisa;

                // Períodos disponíveis para pesquisa
                this.listaPeriodos = pesquisa.periodos.slice(0).reverse();
                this.listaPeriodos = this.pesquisa.periodos.map((periodo) => {

                    return parseInt(periodo.nome);
                });

                // Ano a ser exibido
                if(params.queryParams['ano']){

                    this.anoSelecionado = params.queryParams['ano'];
                }
                else {

                    // Quando não houver um período selecionado, é exibido o período mais recente
                    this.anoSelecionado = Number(this.pesquisa.periodos.sort((a, b) =>  a.nome > b.nome ? 1 : -1 )[(this.pesquisa.periodos.length - 1)].nome);
                }

                // Configuração do ase selecionado na barra de periodo
                if(this.anoSelecionado) {

                    this.indexSelecionado = this.listaPeriodos.findIndex((periodo) => periodo == this.anoSelecionado);

                } else {

                    this.indexSelecionado = this.listaPeriodos.length - 1;
                }

                // Indicador a ter o ranking exibido
                this.indicadorSelecionado = !!params.queryParams['indicador'] ? params.queryParams['indicador'] : this.indicadores[0].id;


            }).subscribe(res => {

                this._obterRanking(this.indicadorSelecionado, this.anoSelecionado, this.localidades).subscribe(ranking => {

                    this.rankings = this._mergeRankingsByContext(ranking);
                });
            });

    }


    public mudaAno(ano){
        this.anoSelecionado = ano;
        this.onAno.emit(ano);
        console.log(ano);
    }

    public getTitulo(idLocalidade, contexto){

        if(contexto.toUpperCase() == 'BR'){

            return 'NO BRASIL';
        }

        return `${this._localidadeService.getMunicipioByCodigo(idLocalidade).nome.toUpperCase()} NO ESTADO DE ${this._localidadeService.getUfByCodigo(parseInt(contexto, 10)).nome}`;
    }

    public getRotulo(valor, unidade, multiplicador){

        return `${valor}${!!multiplicador && multiplicador > 1 ? ' x' + multiplicador : ''} ${!!unidade ? unidade : ''}`;
    }

    public isSelecionado(idLocalidade): boolean{

        let isSelecionado = false;

        this.localidades.forEach(id => {

            if(id ==  idLocalidade){
                isSelecionado = true;
            }            
        });

        return isSelecionado;
    }

    private _obterRanking(idIndicador: number, periodo: string, idLocalidades: number[]){

        let requests: Observable<RankingLocalidade[]>[] = []; 

        idLocalidades.forEach(id => {

            if(!id){
                return;
            }
            
            let localidade: Localidade = this._obterLocalidade(id);
            let contextos: string[] = ['br', localidade.parent.codigo.toString()];

            requests.push( this._indicadorService.getRankingIndicador(idIndicador, periodo, contextos, localidade.codigo) );
        });

        return Observable.zip(...requests);
    }

    private _obterLocalidade(id: number){

        return this._localidadeService.getMunicipioByCodigo(id);
    }

    private _calcularProporcaoValor(maiorValor: number, valor: number){

        return (valor * 100) / maiorValor;
    }

    private _mergeRankingsByContext(listaRankingLocalidade: RankingLocalidade[][]){

        let mergedRanking = {};

        for(let i = 0; i < listaRankingLocalidade.length; i++){

            for(let j = 0; j < listaRankingLocalidade[i].length; j++){

                let contexto = listaRankingLocalidade[i][j].contexto;

                if( !mergedRanking[contexto] ){

                    mergedRanking[contexto] = listaRankingLocalidade[i][j];

                } else {

                    mergedRanking[contexto].listaGrupos = this._mergeLista(mergedRanking[contexto].listaGrupos, listaRankingLocalidade[i][j].listaGrupos);
                }

                if(!listaRankingLocalidade[i][j].listaGrupos){
                    return;
                }


                // Calcula a proporção para exibição do grafico
                for(let itemRanking of listaRankingLocalidade[i][j].listaGrupos){

                    itemRanking['proporcao'] = this._calcularProporcaoValor(Number(listaRankingLocalidade[i][j].listaGrupos[0].valor), Number(itemRanking.valor));
                }
            }
        }

        // Reordena os elementos
        let ranking = [];
        for (var key in mergedRanking) {

            if (mergedRanking.hasOwnProperty(key)) {

                mergedRanking[key].listaGrupos = mergedRanking[key].listaGrupos.sort((a, b) => a.posicao >= b.posicao ? 1 : -1);
                ranking.push(mergedRanking[key]);
            }
        }

        return ranking
    }

    /**
     * Une as duas listas de ItemRanking, removendo itens duplicados.
     */
    private _mergeLista(listaPrincipal: ItemRanking[], listaApartada: ItemRanking[]){

        let indice = this._contruirIndiceRanking(listaPrincipal);

        for(let infoLocalidade of listaApartada){

            if(!this._hasLocalidade(indice, infoLocalidade)){

                listaPrincipal.push(infoLocalidade);
            }
        }

        return listaPrincipal;
    }

    /**
     * Controi um indice que serve para verificar se uma localidade do ranking ja foi processada.
     */
    private _contruirIndiceRanking(lista: ItemRanking[]): Object{

        let indice = {};
        for(let infoLocalidade of lista){

            if(!indice[infoLocalidade.localidade.codigo]){

                indice[infoLocalidade.localidade.codigo] = true;
            }
        }

        return indice;
    }

    /**
     * Verifica se existe a informação da ranking da localidade no indice.
     */
    private _hasLocalidade(indice: {}, infoLocalidade: ItemRanking): boolean{

        return indice[infoLocalidade.localidade.codigo];
    }

}