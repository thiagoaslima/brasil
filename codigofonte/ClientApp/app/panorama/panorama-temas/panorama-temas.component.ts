import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChanges, ViewChild, ElementRef, Inject } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal/browser';
import { DOCUMENT } from '@angular/platform-browser';

import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { TEMAS } from '../configuration/panorama.configuration';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';
import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Resultado } from '../../shared2/resultado/resultado.model';

import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

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
    localidade: Localidade;

    @Input() temaSelecionado: String = '';

    isPrerender = isNode;

    textoTrabalho = "";
    textoMeioAmbiente = "";
    textoEconomia = "";
    textoSaude = "";
    textoEducacao = "";

    constructor(
        private _indicadorService: IndicadorService2,
        private pageScrollService: PageScrollService,
        @Inject(DOCUMENT) private document: any
    ) { }

    public getTextoAnalitico(nomeTema) {

        if (nomeTema === TEMAS.trabalho) {
            return Observable.of(this.textoTrabalho);
        }

        if (nomeTema === TEMAS.meioAmbiente) {
            return Observable.of(this.textoMeioAmbiente);
        }


        if (nomeTema === TEMAS.economia) {
            return Observable.of(this.textoEconomia);
        }


        if (nomeTema === TEMAS.saude) {
            return Observable.of(this.textoSaude);
        }


        if (nomeTema === TEMAS.educacao) {
            return Observable.of(this.textoEducacao);
        }

    }



    ngOnInit() {

        this.goToTema();
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.temas && changes.temas.currentValue && changes.temas.currentValue.length > 0) {
            this.localidade = changes.temas.currentValue[0].localidade;
            this.goToTema();
            // this.configurarTextosTemas();
        }
    }

    private getPosicaoIndicador(idPesquisa: number, indicador: number, codigoLocalidade: number, periodo: string, contexto: string = 'BR'): Observable<any> {
        return this._indicadorService.getPosicaoRelativa(idPesquisa, indicador, periodo, codigoLocalidade, contexto)
    }


    private getValorIndicador(idPesquisa: number, indicador: number, codigoLocalidade: number): Observable<any> {

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

    private configurarTextosTemas() {

        if (!this.localidade || !this.localidade.codigo) {
            return;
        }

        // TODO: Texto TRABALHO
        let salarioMedioMensalUF$ = this.getValorIndicador(19, 29765, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(19, 29765, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let salarioMedioMensalBrasil$ = this.getValorIndicador(19, 29765, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(19, 29765, this.localidade.codigo, resultado.ano));

        let pessoasOcupadasUF$ = this.getValorIndicador(10058, 60036, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60036, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let pessoasOcupadasBrasil$ = this.getValorIndicador(10058, 60036, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60036, this.localidade.codigo, resultado.ano));

        let rendimentoMensalUF$ = this.getValorIndicador(10058, 60037, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60037, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let rendimentoMensalBrasil$ = this.getValorIndicador(10058, 60037, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60037, this.localidade.codigo, resultado.ano));

        salarioMedioMensalUF$.zip(salarioMedioMensalBrasil$, pessoasOcupadasUF$, pessoasOcupadasBrasil$, rendimentoMensalUF$, rendimentoMensalBrasil$)
            .subscribe(([salarioMedioMensalUF, salarioMedioMensalBrasil, pessoasOcupadasUF, pessoasOcupadasBrasil, rendimentoMensalUF, rendimentoMensalBrasil]) => {

                this.textoTrabalho = `Em ${this.localidade.nome}, o salário médio mensal, em ${salarioMedioMensalUF.periodo}, era de ${salarioMedioMensalUF.res} salários mínimos. A proporção de pessoas ocupadas em relação à população total, era de ${pessoasOcupadasUF.res}%. Quando analisado em comparação com os outros municípios de ${this.localidade.parent.sigla}, encontra-se nas posições ${salarioMedioMensalUF.ranking} de ${salarioMedioMensalUF.posicaoAbsoluta} e ${pessoasOcupadasUF.ranking} de ${pessoasOcupadasUF.posicaoAbsoluta} respectivamente. E quando comparado com municípios do Brasil todo, fica em ${salarioMedioMensalBrasil.ranking} de ${salarioMedioMensalBrasil.posicaoAbsoluta} e ${pessoasOcupadasBrasil.ranking} de ${pessoasOcupadasBrasil.posicaoAbsoluta} respectivamente. Sobre os domicílios com rendimentos mensais de até meio salário mínimo por pessoa, ${this.localidade.nome} tinha ${rendimentoMensalUF.res}% da população nestas condições, colocando-o em ${rendimentoMensalUF.ranking} de ${rendimentoMensalUF.posicaoAbsoluta} dentre os municipios de ${this.localidade.parent.sigla} e ${rendimentoMensalBrasil.ranking} de ${rendimentoMensalBrasil.posicaoAbsoluta} dentre os municipios do Brasil.`;
            });


        // TODO: Texto MEIO-AMBIENTE
        let esgotamentoSanitarioUF$ = this.getValorIndicador(10058, 60030, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60030, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let esgotamentoSanitarioBrasil$ = this.getValorIndicador(10058, 60030, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60030, this.localidade.codigo, resultado.ano));

        let arborizacaoUF$ = this.getValorIndicador(10058, 60029, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60029, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let arborizacaoBrasil$ = this.getValorIndicador(10058, 60029, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60029, this.localidade.codigo, resultado.ano));

        let urbanizacaoUF$ = this.getValorIndicador(10058, 60031, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60031, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let urbanizacaoBrasil$ = this.getValorIndicador(10058, 60031, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60031, this.localidade.codigo, resultado.ano));

        esgotamentoSanitarioUF$.zip(esgotamentoSanitarioBrasil$, arborizacaoUF$, arborizacaoBrasil$, urbanizacaoUF$, urbanizacaoBrasil$)
            .subscribe(([esgotamentoSanitarioUF, esgotamentoSanitarioBrasil, arborizacaoUF, arborizacaoBrasil, urbanizacaoUF, urbanizacaoBrasil]) => {

                this.textoMeioAmbiente = `${this.localidade.nome} tem ${esgotamentoSanitarioUF.res}% de domicilios com esgotamento sanitário adequado, ${arborizacaoUF.res}% dos domicilios urbanos em vias publicas com arborização e ${urbanizacaoUF.res}% dos domicílios urbanos em vias públicas com urbanização adequada (presença de bueiro, calçada, pavimentação e meio-fio). Quando comparado com os outros municípios de ${this.localidade.parent.sigla}, fica posicionado em ${esgotamentoSanitarioUF.ranking} de ${esgotamentoSanitarioUF.posicaoAbsoluta}, ${arborizacaoUF.ranking} de ${arborizacaoUF.posicaoAbsoluta} e ${urbanizacaoUF.ranking} de ${urbanizacaoUF.posicaoAbsoluta} respectiviamente. Já quando comparado a outros municípios do Brasil, sua posição é ${esgotamentoSanitarioBrasil.ranking} de ${esgotamentoSanitarioBrasil.posicaoAbsoluta}, ${arborizacaoBrasil.ranking} de ${arborizacaoBrasil.posicaoAbsoluta} e ${urbanizacaoBrasil.ranking} de ${urbanizacaoBrasil.posicaoAbsoluta} respectivamente.`;
            });


        // Texto ECONOMIA
        let pipPerCaptaUF$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let pipPerCaptaBrasil$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano));

        let receitasFontesExternasUF$ = this.getValorIndicador(10058, 60048, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60048, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let receitasFontesExternasBrasil$ = this.getValorIndicador(10058, 60048, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60048, this.localidade.codigo, resultado.ano));

        pipPerCaptaUF$.zip(pipPerCaptaBrasil$, receitasFontesExternasUF$, receitasFontesExternasBrasil$)
            .subscribe(([pipPerCaptaUF, pipPerCaptaBrasil, receitasFontesExternasUF, receitasFontesExternasBrasil]) => {

                this.textoEconomia = `Em ${pipPerCaptaUF.periodo}, ${this.localidade.nome} tinha PIB per capita de R$ ${pipPerCaptaUF.res}. Comparado aos demais municípios do estado, se posicionava entre em ${pipPerCaptaUF.ranking} de ${pipPerCaptaUF.posicaoAbsoluta}. E quando comparado a outros municípios do Brasil, essa colocação é ${pipPerCaptaBrasil.ranking} de ${pipPerCaptaBrasil.posicaoAbsoluta}. ${this.localidade.nome} tinha em ${receitasFontesExternasUF.periodo}, ${receitasFontesExternasUF.res}% do seu orçamento proveniente de fontes externas. Em compração aos outros municípios de ${this.localidade.parent.sigla}, está dentre em ${receitasFontesExternasUF.ranking} de ${receitasFontesExternasUF.posicaoAbsoluta} e quando comparado a municípios no Brasil todo, fica em ${receitasFontesExternasBrasil.ranking} de ${receitasFontesExternasBrasil.posicaoAbsoluta}.`;
            });


        // Texto SAUDE
        let mortaldadeInfantilUF$ = this.getValorIndicador(39, 30279, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(39, 30279, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let mortaldadeInfantilBrasil$ = this.getValorIndicador(39, 30279, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(39, 30279, this.localidade.codigo, resultado.ano));

        let intermacoesDiarreiaUF$ = this.getValorIndicador(10058, 60032, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60032, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        let internacoesDiarreiaBrasil$ = this.getValorIndicador(10058, 60032, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60032, this.localidade.codigo, resultado.ano));

        mortaldadeInfantilUF$.zip(mortaldadeInfantilBrasil$, intermacoesDiarreiaUF$, internacoesDiarreiaBrasil$)
            .subscribe(([mortaldadeInfantilUF, mortaldadeInfantilBrasil, intermacoesDiarreiaUF, internacoesDiarreiaBrasil]) => {

                this.textoSaude = `A taxa de mortalidade infantil média no município é de ${mortaldadeInfantilUF.res} para 1.000 nascidos vivos. As internações devido a diarréias são de ${intermacoesDiarreiaUF.res} para cada 1.000 habitantes. Comparado com todos os municípios do estado, posiciona-se em ${mortaldadeInfantilUF.ranking} de ${mortaldadeInfantilUF.posicaoAbsoluta} e ${intermacoesDiarreiaUF.ranking} de ${intermacoesDiarreiaUF.posicaoAbsoluta} respectivamente. Quando comparado a municípios no Brasil essas posições são de ${mortaldadeInfantilBrasil.ranking} de ${mortaldadeInfantilBrasil.posicaoAbsoluta} e ${internacoesDiarreiaBrasil.ranking} de ${mortaldadeInfantilBrasil.posicaoAbsoluta}.`;
            });


        // Texto EDUCAÇÃO
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

        idebAnosIniciaisUF$.zip(idebAnosIniciaisBrasil$, idebAnosFinaisUF$, idebAnosFinaisBrasil$, taxaEscolarizacao6A14AnosUF$, taxaEscolarizacao6A14AnosBrasil$)
            .subscribe(([idebAnosIniciaisUF, idebAnosIniciaisBrasil, idebAnosFinaisUF, idebAnosFinaisBrasil, taxaEscolarizacao6A14AnosUF, taxaEscolarizacao6A14AnosBrasil]) => {

                this.textoEducacao = `Em ${idebAnosIniciaisBrasil.periodo}, os alunos dos anos inicias da rede pública do município, tiveram nota média de ${idebAnosIniciaisBrasil.res} no IDEB. Para os alunos dos anos finais essa nota foi de ${idebAnosFinaisBrasil.res}. Comparados aos municíos do mesmo estado, a nota dos alunos dos anos inciais coloca o município dentre em ${idebAnosIniciaisUF.ranking} de ${idebAnosIniciaisUF.posicaoAbsoluta}. Para a nota dos alunos dos anos finais, a posição é de ${idebAnosFinaisUF.ranking} de ${idebAnosFinaisUF.posicaoAbsoluta}. Quanto a taxa de escolarização (para pessoas de 6 a 14 anos), esta foi de ${taxaEscolarizacao6A14AnosBrasil.res} em ${taxaEscolarizacao6A14AnosBrasil.periodo}. Isso posiciona o município em ${taxaEscolarizacao6A14AnosUF.ranking} de ${taxaEscolarizacao6A14AnosUF.posicaoAbsoluta} do ${this.localidade.parent.sigla} e em ${taxaEscolarizacao6A14AnosBrasil.ranking} de ${taxaEscolarizacao6A14AnosBrasil.posicaoAbsoluta} no Brasil.`;
            });


    }
	
public goToTop(tema): void {
         let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, tema);
         this.pageScrollService.start(pageScrollInstance);
     }; 
}