import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';
import { RouterParamsService } from '../../shared/router-params.service';
import { ItemRanking, RankingLocalidade } from './ranking.model';


@Component({
    selector: 'pesquisa-ranking',
    templateUrl: './pesquisa-ranking.template.html',
    styleUrls: ['./pesquisa-ranking.style.css']
})
export class PesquisaRankingComponent implements OnInit {

    idIndicador: number;
    periodo: string = '2010';
    idLocalidades: number[] = [];

    indicadores;


    constructor(
        private _routerParams:RouterParamsService,
        private _indicadorService: IndicadorService2,
        private _localidadeService: LocalidadeService2
    ) { }

    ngOnInit() {

        this._routerParams.params$.map(urlParams => {

            return urlParams;

        }).flatMap(urlParams => {

            this.idLocalidades = [];

            // Obter localidade principal
            this.idLocalidades[0] = (this._localidadeService.getMunicipioBySlug(urlParams.params['uf'],  urlParams.params['municipio'])).codigo;

            // Obter localidades de comparação
            if(urlParams.queryParams['localidade1'] && urlParams.queryParams['localidade1'] > 0){
                this.idLocalidades.push(urlParams.queryParams['localidade1']);
            }
            if(urlParams.queryParams['localidade2'] && urlParams.queryParams['localidade2'] > 0){
                this.idLocalidades.push(urlParams.queryParams['localidade2']);
            }

            return this._obterRanking(parseInt(urlParams.queryParams['indicador']), this.periodo, this.idLocalidades);

        }).subscribe(ranking => {

            this.indicadores = [];

            this.indicadores = this._mergeRankingsByContext(ranking);
        });
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


    private _obterRanking(idIndicador: number, periodo: string, idLocalidades: number[]){

        let requests: Observable<RankingLocalidade[]>[] = []; 

        idLocalidades.forEach(id => {
            
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

        debugger;

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