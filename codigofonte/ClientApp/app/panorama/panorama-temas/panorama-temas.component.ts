import { Localidade } from '../../shared/localidade/localidade.interface';
import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';

import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model'
import { IndicadorService2 } from '../../shared2/indicador/indicador.service'


@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html',
    styleUrls: ['./panorama-temas.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaTemasComponent implements OnInit {
    @Input('dados') temas: {
        tema: string,
        painel: PanoramaConfigurationItem[],
        grafico: GraficoConfiguration[]
    };
    @Input() localidade: Localidade;

    constructor(
        private _indicadorService:IndicadorService2
    ) {  }
    

    getTextoAnalitico(nomeTema){

        //debugger;
        
        // this._indicadorService.getIndicadoresById(10058, 60041, EscopoIndicadores.proprio, this.localidade.codigo).subscribe(res => {

        //     debugger;

        //     console.log(res[0].getResultadoByLocal(this.localidade.codigo));
        // });

        let valoresEducacao = {
            idebInicial:"IDEBINIUCIAL",
            idebFinal:"IDEBFINAL",
            idebInicialPosicaoUF:"IDEB-ini-POSICAOUF",
            idebInicialPosicaoBR:"IDEB-iniPOSICAOUF",
            idebFinalPosicaoUF:"IDEBPOSICAOBR",
            idebFinalPosicaoBR:"IDEBPOSICAOBR",
            taxaEscolaridade:"TAXAESCOL",
            taxaEscolaridadePosUF:"TAXAESCOLPOS-UF",
            taxaEscolaridadePosBR:"TAXAESCOLPOS-BR"
        };
        
        let textoEducacao = `Em 2015, os alunos dos anos inicias da rede pública do município, tiveram nota média de ${valoresEducacao.idebInicial} no IDEB. Para os alunos dos anos finais essa nota foi de ${valoresEducacao.idebFinal}. Comparados aos municíos do mesmo estado, a nota dos alunos dos anos inciais coloca o município dentre os ${valoresEducacao.idebInicialPosicaoUF}% MELHOR/PIORES. Para a nota dos alunos dos anos finais, a posição é de ${valoresEducacao.idebFinalPosicaoUF}% DOS MELHORES/PIORES. Quando comparado a municípios brasileiros de mesmo porte populacional essa posição é dentre os ${valoresEducacao.idebInicialPosicaoBR}% MELHOR/PIOR para alunos dos anos inicias e ${valoresEducacao.idebFinalPosicaoBR}% para os alunos dos anos finais. Quanto a taxa de escolarização (para pessoas de 6 a 14 anos), esta foi de ${valoresEducacao.taxaEscolaridade} em 2010. Isso posiciona o município entre os ${valoresEducacao.taxaEscolaridadePosUF} MELHOR PIOR  DO ESTADO/UF e entre os ${valoresEducacao.taxaEscolaridadePosBR} MELHORES/PIORES do Brasil (entre municípios de mesmo porte populacional)`;
        
        let texto;
        if(nomeTema === "Educação"){
            texto = textoEducacao;
        }
        
        
        return texto;
        
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) { }


}