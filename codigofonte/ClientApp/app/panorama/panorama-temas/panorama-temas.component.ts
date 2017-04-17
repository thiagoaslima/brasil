import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChanges, ViewChild, ElementRef, Inject } from '@angular/core';
import { Observer, Observable } from 'rxjs';

import { DOCUMENT } from '@angular/platform-browser';

import { Localidade } from '../../shared/localidade/localidade.interface';

import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { TEMAS } from '../configuration/panorama.configuration';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';

import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Resultado } from '../../shared2/resultado/resultado.model';

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

    public getTextoAnalitico(nomeTema): Observable<string>{

        // TODO: Implementar texto do tema Trabalho
        if(nomeTema === TEMAS.trabalho){

            // let pipPerCaptaUF$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            //     .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            // let pipPerCaptaBrasil$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            //     .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano));

            // return $.zip()
            //     .map(([]) => {

            //         debugger;

            //         return `Em MUNICIPIO, o salário médio mensal, em 2014, era de XX salários mínimos. A proporção de pessoas ocupadas em relação à população total, era de XX%. Quando analisado em comparação com os municpios da mesma UF, encontra-se nas posições X de Y e X de Y respectivamente. E quando comparado com municípios de mesmo porte populacional no Brasil todo, fica em X de Y e X de Y respectivamente. Sobre os domicílios com rendimentos mensais de até meio salário mínimo por pessoa, MUNICIPIO tinha X% da população nestas condições, colocando-o em X de Y dentre os municipios da UF e X de Y dentre os municipios de mesmo porte populacional do Brasil.`;
            //     });
        }        


        // TODO: Implementar texto do tema Meio Ambiente
        if(nomeTema === TEMAS.meioAmbiente){

            // let pipPerCaptaUF$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            //     .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            // let pipPerCaptaBrasil$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            //     .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano));

            // return $.zip()
            //     .map(([]) => {

            //         debugger;

            //         return `MUNICIPIO tem X% de domicilios com esgotamento sanitário adequado, XX% dos domicilios urbanos em vias publicas com arborização e XX% dos domicílios urbanos em vias públicas com urbanização adequada (presença de bueiro, calçada, pavimentação e meio-fio). Quando comparado com municípios de UF fica posicionado em XX%, XX% e XX% respectiviamente. Já quando comparado a outros municípios de mesmo porte populacional em todo o Brasil, sua posição é entre os XX%, XX% e XX% respectivamente.`;
            //     });
        }


        if(nomeTema === TEMAS.economia){

            let pipPerCaptaUF$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            let pipPerCaptaBrasil$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano));

            let receitasFontesExternasUF$ = this.getValorIndicador(10058, 60048, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(10058, 60048, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            let receitasFontesExternasBrasil$ = this.getValorIndicador(10058, 60048, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(10058, 60048, this.localidade.codigo, resultado.ano));

            return pipPerCaptaUF$.zip(pipPerCaptaBrasil$, receitasFontesExternasUF$, receitasFontesExternasBrasil$)
                .map(([pipPerCaptaUF, pipPerCaptaBrasil, receitasFontesExternasUF, receitasFontesExternasBrasil]) => {

                    //debugger;

                    return `Em ${pipPerCaptaUF.periodo} ${this.localidade.nome} tinha PIB per capita de R$ ${pipPerCaptaUF.res}. Comparado aos demais municípios de ${this.localidade.parent.sigla}, se posicionava entre os ${pipPerCaptaUF.ranking} melhores. E quando comparado a outros municípios do Brasil, essa colocação é de ${pipPerCaptaBrasil.ranking} melhores. ${this.localidade.nome} tinha em ${receitasFontesExternasUF.periodo}, ${receitasFontesExternasUF.res} do seu orçamento proveniente de fontes externas. Em compração aos outros municípios de ${this.localidade.parent.sigla}, está dentre os ${receitasFontesExternasUF.ranking} melhores e quando comparado a municípios no Brasil todo, fica dentre os ${receitasFontesExternasBrasil.ranking} melhores.`;
                });
        }


        if(nomeTema === TEMAS.saude){

            let mortaldadeInfantilUF$ = this.getValorIndicador(39, 30279, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(39, 30279, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            let mortaldadeInfantilBrasil$ = this.getValorIndicador(39, 30279, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(39, 30279, this.localidade.codigo, resultado.ano));

            let intermacoesDiarreiaUF$ = this.getValorIndicador(10058, 60032, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(10058, 60032, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            let internacoesDiarreiaBrasil$ = this.getValorIndicador(10058, 60032, this.localidade.codigo)
                .flatMap(resultado => this.getPosicaoIndicador(10058, 60032, this.localidade.codigo, resultado.ano));

            return mortaldadeInfantilUF$.zip(mortaldadeInfantilBrasil$, intermacoesDiarreiaUF$, internacoesDiarreiaBrasil$)
                .map(([mortaldadeInfantilUF, mortaldadeInfantilBrasil, intermacoesDiarreiaUF, internacoesDiarreiaBrasil]) => {

                    return `A taxa de mortalidade infantil média no município é de ${mortaldadeInfantilUF.res} para 1.000 nascidos vivos. As internações devido a diarréias são de ${intermacoesDiarreiaUF.res} para cada 1.000 habitantes. Comparado com todos os municípios de ${this.localidade.parent.sigla}, posiciona-se nos ${mortaldadeInfantilUF.ranking} melhores e ${intermacoesDiarreiaUF.ranking} melhores respectivamente. Quando comparado a municípios no Brasil essas posições são de ${mortaldadeInfantilBrasil.ranking} e ${internacoesDiarreiaBrasil.ranking}.`;
                });
        }

        
        if(nomeTema === TEMAS.educacao){

            let idebAnosIniciaisUF$ = this.getValorIndicador(10058, 60041, this.localidade.codigo)
                    .flatMap(resultado => this.getPosicaoIndicador(10058, 60041, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            let idebAnosIniciaisBrasil$ = this.getValorIndicador(10058, 60041, this.localidade.codigo)
                    .flatMap(resultado => this.getPosicaoIndicador(10058, 60041, this.localidade.codigo, resultado.ano));

            let idebAnosFinaisUF$ = this.getValorIndicador(10058, 60042, this.localidade.codigo)
                    .flatMap(resultado => this.getPosicaoIndicador(10058, 60042, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            let idebAnosFinaisBrasil$ = this.getValorIndicador(10058, 60042, this.localidade.codigo)
                    .flatMap(resultado => this.getPosicaoIndicador(10058, 60042, this.localidade.codigo, resultado.ano));

            let taxaEscolarizacao6A14AnosUF$ = this.getValorIndicador(10058, 60045, this.localidade.codigo)
                    .flatMap(resultado => this.getPosicaoIndicador(10058, 60045, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

            let taxaEscolarizacao6A14AnosBrasil$ = this.getValorIndicador(10058, 60045, this.localidade.codigo)
                    .flatMap(resultado => this.getPosicaoIndicador(10058, 60045, this.localidade.codigo, resultado.ano));

            return Observable.of().flatMap(() => {
                return idebAnosIniciaisUF$.zip(idebAnosIniciaisBrasil$, idebAnosFinaisUF$, idebAnosFinaisBrasil$, taxaEscolarizacao6A14AnosUF$, taxaEscolarizacao6A14AnosBrasil$)
                .map(([idebAnosIniciaisUF, idebAnosIniciaisBrasil, idebAnosFinaisUF, idebAnosFinaisBrasil, taxaEscolarizacao6A14AnosUF, taxaEscolarizacao6A14AnosBrasil]) => {

                    return `Em ${idebAnosIniciaisBrasil.periodo}, os alunos dos anos inicias da rede pública do município, tiveram nota média de ${idebAnosIniciaisBrasil.res} no IDEB. Para os alunos dos anos finais essa nota foi de ${idebAnosFinaisBrasil.res}. Comparados aos municíos do mesmo estado, a nota dos alunos dos anos inciais coloca o município dentre os ${idebAnosIniciaisUF.ranking} melhores. Para a nota dos alunos dos anos finais, a posição é de ${idebAnosFinaisUF.ranking}. Quanto a taxa de escolarização (para pessoas de 6 a 14 anos), esta foi de ${taxaEscolarizacao6A14AnosBrasil.res} em ${taxaEscolarizacao6A14AnosBrasil.periodo}. Isso posiciona o município entre os ${taxaEscolarizacao6A14AnosUF.ranking} melhores do ${this.localidade.parent.sigla} e entre os ${taxaEscolarizacao6A14AnosBrasil.ranking} melhores do Brasil.`;
                });
            })
        }

        return Observable.of(`Teste - ${nomeTema}`); 
        
    }



    ngOnInit() { this.goToTema(); }


    ngOnChanges(changes: SimpleChanges) { 

        this.goToTema();
    }

    private getPosicaoIndicador(idPesquisa: number, indicador: number, codigoLocalidade: number, periodo: string, contexto: string = 'BR'): Observable<any>{

        return this._indicadorService.getPosicaoRelativa(idPesquisa, indicador, periodo, codigoLocalidade, contexto)
    }
    

    private getValorIndicador(idPesquisa: number, indicador: number, codigoLocalidade: number): Observable<any>{

        return this._indicadorService.getIndicadoresById(idPesquisa, indicador, EscopoIndicadores.proprio, codigoLocalidade)
                    .switchMap(indicadores => indicadores[0].getResultadoByLocal(this.localidade.codigo))
                    .map(resultado => {
                        
                        return {
                            "valor": resultado.valorValidoMaisRecente,
                            "ano": resultado.periodoValidoMaisRecente
                        }  
                    });
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