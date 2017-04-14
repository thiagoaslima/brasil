import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChanges, ViewChild, ElementRef, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';

import { Localidade } from '../../shared/localidade/localidade.interface';

import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';

import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';

import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';


@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html',
    styleUrls: ['./panorama-temas.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanoramaTemasComponent implements OnInit {

    @ViewChild('cont')
     private container: ElementRef;

    @Input('dados') temas: {
        tema: string,
        painel: PanoramaConfigurationItem[],
        grafico: GraficoConfiguration[]
    };
    @Input() localidade: Localidade;

    @Input() temaSelecionado: String = '';


    constructor(private _indicadorService:IndicadorService2, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) { }

    public getTextoAnalitico(nomeTema){

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

        let textoEducacao = `Em 2015, os alunos dos anos inicias da rede pública do município, tiveram nota média de ${valoresEducacao.idebInicial} no IDEB. Para os alunos dos anos finais essa nota foi de ${valoresEducacao.idebFinal}. Comparados aos municíos da mesma UF, a nota dos alunos dos anos inciais coloca o município dentre os ${valoresEducacao.idebInicialPosicaoUF}% MELHOR/PIORES. Para a nota dos alunos dos anos finais, a posição é de ${valoresEducacao.idebFinalPosicaoUF}% DOS MELHORES/PIORES. Quando comparado a municípios brasileiros de mesmo porte populacional essa posição é dentre os ${valoresEducacao.idebInicialPosicaoBR}% MELHOR/PIOR para alunos dos anos inicias e ${valoresEducacao.idebFinalPosicaoBR}% para os alunos dos anos finais. Quanto a taxa de escolarização (para pessoas de 6 a 14 anos), esta foi de ${valoresEducacao.taxaEscolaridade} em 2010. Isso posiciona o município entre os ${valoresEducacao.taxaEscolaridadePosUF} MELHOR PIOR  DO ESTADO/UF e entre os ${valoresEducacao.taxaEscolaridadePosBR} MELHORES/PIORES do Brasil (entre municípios de mesmo porte populacional)`;
        
        // let textoTrabalho = `Em MUNICIPIO, o salário médio mensal, em 2014, era de XX salários mínimos. A proporção de pessoas ocupadas em relação à população total, era de XX%. Quando analisado em comparação com os municpios da mesma UF, encontra-se nas posições X de Y e X de Y respectivamente. E quando comparado com municípios de mesmo porte populacional no Brasil todo, fica em X de Y e X de Y respectivamente. Sobre os domicílios com rendimentos mensais de até meio salário mínimo por pessoa, MUNICIPIO tinha X% da população nestas condições, colocando-o em X de Y dentre os municipios da UF e X de Y dentre os municipios de mesmo porte populacional do Brasil.`;
        
        // let textoSaude = `A taxa de mortalidade infantil média no município é de XX para 1.000 nascidos vivos. As internações devido a diarréias são de XX para cada 1.000 habitantes. Comparado com todos os municípios de UFESTADO, posiciona-se nos XX% MELHOREr/PIORES e XX% MELHORES/PIORES respectivamente. Quando comparado a municípios de mesmo porte populacional no Brasil essas posições são de XX% e XX%.`;
        
        // let textoAmbiente = `MUNICIPIO tem X% de domicilios com esgotamento sanitário adequado, XX% dos domicilios urbanos em vias publicas com arborização e XX% dos domicílios urbanos em vias públicas com urbanização adequada (presença de bueiro, calçada, pavimentação e meio-fio). Quando comparado com municípios de UF fica posicionado em XX%, XX% e XX% respectiviamente. Já quando comparado a outros municípios de mesmo porte populacional em todo o Brasil, sua posição é entre os XX%, XX% e XX% respectivamente.`;
        
        // let textoEconomia = `Em 2014 MUNICIPIO tinha PIB per capita de R$ XXXX. Comparado aos demais municípios de UF, se posicionava entre os XX% MELHORE/PIORES. E quando comparado a outros municípios de mesmo porte populacional em todo o Brasil, essa colocação é de XX% MELHORES/PIORES. MUNICIPIO tinha em 2015, XX% do seu orçamento proveniente de fontes externas. Em compração aos outros municípios de UF, está dentre os XX% MELHORES/PIORES e quando comparado a municípios de mesmo porte populacional no Brasil todo, fica dentre os XX% MELHORES/PIORES.`;

        
        let texto;
        if(nomeTema === "Educação"){
            texto = textoEducacao;
        }
        
        
        return texto;
        
    }

    ngOnInit() { this.goToTema(); }

    ngOnChanges(changes: SimpleChanges) { this.goToTema();}

    private getValorIndicador(idPesquisa: number, idIndicador: number, codigoLocalidade: number, periodo: string){

        return this._indicadorService.getIndicadoresById(idPesquisa, idIndicador, EscopoIndicadores.proprio, codigoLocalidade)
                    .switchMap(indicadores => indicadores[0].getResultadoByLocal(this.localidade.codigo))
                    .map(resulatado => resulatado.getValor(periodo));
    }

    public goToTema(): void {
         let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.temaSelecionado && this.temaSelecionado.toString());
         this.pageScrollService.start(pageScrollInstance);
     };    
 
    //  public goToHeadingInContainer(): void {
    //      let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: this.document, scrollTarget: '#cont', scrollingViews: [this.container.nativeElement]});
    //      this.pageScrollService.start(pageScrollInstance);
    //  };

}