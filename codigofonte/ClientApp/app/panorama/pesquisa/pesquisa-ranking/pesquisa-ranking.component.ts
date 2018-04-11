import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs/Rx';

import { ItemRanking, RankingLocalidade } from './ranking.model';

import { 
    TraducaoService,
    RouterParamsService,
    LocalidadeService3,
    PesquisaService3,
    IndicadorService3,
    RankingService3,
    Localidade,
    ResultadoPipe
} from '../../../shared/';

import { ModalErrorService } from '../../../core/';


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
    @Input() periodo: string;
    @Input() breadcrumb;

    @Output() onAno = new EventEmitter;

    public rankings;
    public listaPeriodos;

    private localidadeByContexto;

    private _resultadoPipe: ResultadoPipe;

    public unidade;
    public multiplicador;

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _routerParams: RouterParamsService,
        private _activatedRoute: ActivatedRoute,
        private _indicadorService: IndicadorService3,
        private _localidadeService: LocalidadeService3,
        private _pesquisaService: PesquisaService3,
        private _rankingService: RankingService3,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService
    ) { 
        this._resultadoPipe = new ResultadoPipe();
    }

    ngOnInit() {

        this.localidadeByContexto = this.getLocalidadesByContexto(this.localidades);

        this._carregarRanking(this._activatedRoute.snapshot);
    }

    ngOnChanges() {

        this.localidadeByContexto = this.getLocalidadesByContexto(this.localidades);

        this._carregarRanking(this._activatedRoute.snapshot);
    }

    private _carregarRanking(params) {

        if (this.pesquisa && this.localidades && this.localidades.length > 0) {
            this.listaPeriodos = this.pesquisa.periodos.map((periodo) => {
                return periodo.nome;
            });

            let indicadador = !!this.indicadorSelecionado ? this.indicadorSelecionado : this.indicadores[0].id;

            this._obterRanking(indicadador, this.periodo, this.localidades).subscribe(ranking => {

                this.rankings = this._mergeRankingsByContext(ranking);


                if (!!this.rankings && !!this.rankings[0] && !!this.rankings[0].listaGrupos && !!this.rankings[0].listaGrupos[0]) {

                    this.unidade = this.rankings[0].listaGrupos[0].unidadeMedida;
                    this.multiplicador = this.rankings[0].listaGrupos[0].fatorMultiplicativo;
                }
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
            });
        }
    }

    public hasDados(): boolean {

        if (!this.rankings) {
            return false;
        }

        let hasDados = false;

        for (let ranking of this.rankings) {

            if (!!ranking.listaGrupos && ranking.listaGrupos.length > 0) {

                hasDados = true;
                break;
            }
        }

        return hasDados;
    }

    private getLocalidadesByContexto(idLocalidade: number[]): Object {

        let contextos = {};

        idLocalidade.forEach(id => {

            if (!!id && id > 0) {

                let localidade = this._obterLocalidade(id);

                if (!!contextos[localidade.parent.codigo]) {

                    contextos[localidade.parent.codigo].push(localidade.nome.toUpperCase());
                }
                else {

                    contextos[localidade.parent.codigo] = [localidade.nome.toUpperCase()];

                }

            }
        });

        return contextos;
    }

    public mudaAno(ano) {
        this.onAno.emit(ano);
    }

    public getPreTitulo(contexto) {
        
       if(contexto.toUpperCase() == 'BR'){

            return;
        }

        if(!this.localidadeByContexto[contexto]){
            return;
        }

        return `${this.localidadeByContexto[contexto].join(', ')}`;
    }

    public getNoContext(contexto) {
        
       if(contexto.toUpperCase() == 'BR'){

            return 'pesquisa_ranking__no_brasil';
        }

        if(!this.localidadeByContexto[contexto]){
            return;
        }

        return `pesquisa_ranking__no_estado`;
    }

    public getPreposicao(contexto) {
        
       if(contexto.toUpperCase() == 'BR'){

            return;
        }

        if(!this.localidadeByContexto[contexto]){
            return;
        }

        return `${this._localidadeService.getPreprosicaoTituloUF(this._localidadeService.getUfByCodigo(parseInt(contexto, 10)).nome).toUpperCase()}`;
    }

    public getPosTitulo(contexto) {

       if(contexto.toUpperCase() == 'BR'){

            return;
        }

        if(!this.localidadeByContexto[contexto]){
            return;
        }

        return ` ${this._localidadeService.getUfByCodigo(parseInt(contexto, 10)).nome}`;
    }

    public getTitulo(contexto){

        if (contexto.toUpperCase() == 'BR') {

            return 'NO BRASIL';
        }

        if (!this.localidadeByContexto[contexto]) {
            return;
        }

        return `${this.localidadeByContexto[contexto].join(', ')} NO ESTADO ${this._localidadeService.getPreprosicaoTituloUF(this._localidadeService.getUfByCodigo(parseInt(contexto, 10)).nome).toUpperCase()} ${this._localidadeService.getUfByCodigo(parseInt(contexto, 10)).nome}`;
    }

    public getRotulo(valor, unidade, multiplicador) {

        valor = this._resultadoPipe.transform(valor, unidade);
        return `${valor}${!!multiplicador && multiplicador > 1 ? ' x' + multiplicador : ''} ${!!unidade ? unidade : ''}`;
    }

    public isSelecionado(idLocalidade): boolean {

        let isSelecionado = false;

        this.localidades.forEach(id => {

            if (id == idLocalidade) {
                isSelecionado = true;
            }
        });

        return isSelecionado;
    }

    private _obterRanking(indicadorId: number, periodo: string, idLocalidades: number[]) {

        let requests: Observable<RankingLocalidade[]>[] = [];

        idLocalidades.forEach(id => {

            if (!id || id == 0) {
                return;
            }

            let localidade: Localidade = this._obterLocalidade(id);
            let contextos: string[] = ['br']
            if (!!localidade && !!localidade.parent && !!localidade.parent.codigo) {
                contextos.push(localidade.parent.codigo.toString());
            }

            requests.push(this._rankingService.getRankingIndicador(indicadorId, periodo, contextos, localidade.codigo, localidade.tipo == 'uf'? 3 : 4));
        });

        return Observable.zip(...requests);
    }

    private _obterLocalidade(id: number) {

        // Se o código for de uma UF
        if (String(id).length == 2) {

            return this._localidadeService.getUfByCodigo(id);
        }

        return this._localidadeService.getMunicipioByCodigo(id);
    }

    private _calcularProporcaoValor(maiorValor: number, valor: number) {

        return (valor * 100) / maiorValor;
    }

    private _mergeRankingsByContext(listaRankingLocalidade: RankingLocalidade[][]) {

        let mergedRanking = {};

        for (let i = 0; i < listaRankingLocalidade.length; i++) {

            for (let j = 0; j < listaRankingLocalidade[i].length; j++) {

                let contexto = listaRankingLocalidade[i][j].contexto;

                if (!mergedRanking[contexto]) {

                    mergedRanking[contexto] = listaRankingLocalidade[i][j];

                } else {

                    mergedRanking[contexto].listaGrupos = this._mergeLista(mergedRanking[contexto].listaGrupos, listaRankingLocalidade[i][j].listaGrupos);
                }

                if (!listaRankingLocalidade[i][j].listaGrupos) {
                    return;
                }


                // Calcula a proporção para exibição do grafico
                for (let itemRanking of listaRankingLocalidade[i][j].listaGrupos) {

                    itemRanking['proporcao'] = this._calcularProporcaoValor(Number(listaRankingLocalidade[i][j].listaGrupos[0].valor), Number(itemRanking.valor));
                }
            }
        }

        // Reordena os elementos
        let ranking = [];
        for (var key in mergedRanking) {

            if (mergedRanking.hasOwnProperty(key)) {

                mergedRanking[key].listaGrupos = (mergedRanking[key].listaGrupos).sort((a, b) => a.posicao >= b.posicao ? 1 : -1);
                ranking.push(mergedRanking[key]);
            }
        }

        return ranking
    }

    /**
     * Une as duas listas de ItemRanking, removendo itens duplicados.
     */
    private _mergeLista(listaPrincipal: ItemRanking[], listaApartada: ItemRanking[]) {

        let indice = this._contruirIndiceRanking(listaPrincipal);

        for (let infoLocalidade of listaApartada) {

            if (!this._hasLocalidade(indice, infoLocalidade)) {

                listaPrincipal.push(infoLocalidade);
            }
        }

        return listaPrincipal;
    }

    /**
     * Controi um indice que serve para verificar se uma localidade do ranking ja foi processada.
     */
    private _contruirIndiceRanking(lista: ItemRanking[]): Object {

        let indice = {};
        for (let infoLocalidade of lista) {

            if (!indice[infoLocalidade.localidade.codigo]) {

                indice[infoLocalidade.localidade.codigo] = true;
            }
        }

        return indice;
    }

    /**
     * Verifica se existe a informação da ranking da localidade no indice.
     */
    private _hasLocalidade(indice: {}, infoLocalidade: ItemRanking): boolean {

        return indice[infoLocalidade.localidade.codigo];
    }

}