import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';
import { ItemRanking, RankingLocalidade } from './ranking.model';


@Component({
    selector: 'pesquisa-ranking',
    templateUrl: './pesquisa-ranking.template.html',
    styleUrls: ['./pesquisa-ranking.style.css']
})

export class PesquisaRankingComponent implements OnInit {

    
    idIndicador: number = 60031;
    periodo: string = '2010';
    idLocalidades: number[] = [330455, 431517, 330010];

    indicadores;

    constructor(
        private _indicadorService: IndicadorService2,
        private _localidadeService: LocalidadeService2
    ) { }

    ngOnInit() {

        this._obterRanking(this.idIndicador, this.periodo, this.idLocalidades).subscribe(ranking => {

            debugger;
            this.indicadores = ranking;
        });

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

    

    private _getTitulo(idLocalidade, contexto){

        return `${this._localidadeService.getMunicipioByCodigo(idLocalidade).nome.toUpperCase()} NO ${contexto.toUpperCase() == 'BR' ? 'BRASIL' : 'ESTADO DE ' + this._localidadeService.getUfByCodigo(parseInt(contexto, 10))}`;
    }

    private _calcularProporcaoValor(maiorValor: number, valor: number){

        return (valor * 100) / maiorValor;
    }


}