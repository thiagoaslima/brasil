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
    }[];
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
            this.configurarTextosTemas();
        }
        this.goToTema();
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

        // const hash = this.temas.reduce((arr, tema) => arr.concat(tema.painel), []).reduce((acc, painel) => {
        //     return Object.assign(acc, { [painel.indicadorId]: painel.ranking })
        // }, {});
        const contextoLocal = this.localidade.parent.codigo.toString();
        const universoLocal = this.localidade.parent.children.length;
        const contextoGeral = 'BR';
        const universoGeral = '5570';


        // TODO: Texto TRABALHO
        // const salarioMedioMensalUF = hash[29765][contextoLocal];
        let salarioMedioMensalUF$ = this.getValorIndicador(19, 29765, this.localidade.codigo)
             .flatMap(resultado => this.getPosicaoIndicador(19, 29765, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const salarioMedioMensalBrasil = hash[29765][contextoGeral];
        let salarioMedioMensalBrasil$ = this.getValorIndicador(19, 29765, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(19, 29765, this.localidade.codigo, resultado.ano));

        // const pessoasOcupadasUF = hash[60036][contextoLocal];
        let pessoasOcupadasUF$ = this.getValorIndicador(10058, 60036, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60036, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const pessoasOcupadasBrasil = hash[60036][contextoGeral];
        let pessoasOcupadasBrasil$ = this.getValorIndicador(10058, 60036, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60036, this.localidade.codigo, resultado.ano));

        // const rendimentoMensalUF = hash[60036][contextoLocal];
        let rendimentoMensalUF$ = this.getValorIndicador(10058, 60037, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60037, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const rendimentoMensalBrasil = hash[60036][contextoGeral];
        let rendimentoMensalBrasil$ = this.getValorIndicador(10058, 60037, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60037, this.localidade.codigo, resultado.ano));

       salarioMedioMensalUF$.zip(salarioMedioMensalBrasil$, pessoasOcupadasUF$, pessoasOcupadasBrasil$, rendimentoMensalUF$, rendimentoMensalBrasil$)
           .subscribe(([salarioMedioMensalUF, salarioMedioMensalBrasil, pessoasOcupadasUF, pessoasOcupadasBrasil, rendimentoMensalUF, rendimentoMensalBrasil]) => {

        this.textoTrabalho = `Em ${this.localidade.nome}, o salário médio mensal, em ${salarioMedioMensalUF.periodo}, 
            era de ${salarioMedioMensalUF.res} salários mínimos. 
            A proporção de pessoas ocupadas em relação à população total, era de ${pessoasOcupadasUF.res}%. 
            Quando analisado em comparação com os outros municípios de ${this.localidade.parent.sigla}, 
            encontra-se nas posições ${salarioMedioMensalUF.ranking} de ${universoLocal} e 
            ${pessoasOcupadasUF.ranking} de ${universoLocal} respectivamente. 
            E quando comparado com municípios do Brasil todo, fica em ${salarioMedioMensalBrasil.ranking} de ${universoGeral} e 
            ${pessoasOcupadasBrasil.ranking} de ${universoGeral} respectivamente. 
            Sobre os domicílios com rendimentos mensais de até meio salário mínimo por pessoa, 
            ${this.localidade.nome} tinha ${rendimentoMensalUF.res}% da população nestas condições, 
            colocando-o em ${rendimentoMensalUF.ranking} de ${universoLocal} dentre os municipios de ${this.localidade.parent.sigla} e 
            ${rendimentoMensalBrasil.ranking} de ${universoGeral} dentre os municipios do Brasil.`;
        });


        // TODO: Texto MEIO-AMBIENTE
        // const esgotamentoSanitarioUF = hash[60030][contextoLocal];
        let esgotamentoSanitarioUF$ = this.getValorIndicador(10058, 60030, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60030, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const esgotamentoSanitarioBrasil = hash[60030][contextoGeral];
        let esgotamentoSanitarioBrasil$ = this.getValorIndicador(10058, 60030, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60030, this.localidade.codigo, resultado.ano));

        // const arborizacaoUF = hash[60029][contextoLocal];
        let arborizacaoUF$ = this.getValorIndicador(10058, 60029, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60029, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const arborizacaoBrasil = hash[60029][contextoGeral];
        let arborizacaoBrasil$ = this.getValorIndicador(10058, 60029, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60029, this.localidade.codigo, resultado.ano));

        // const urbanizacaoUF = hash[60031][contextoLocal];
        let urbanizacaoUF$ = this.getValorIndicador(10058, 60031, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60031, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const urbanizacaoBrasil = hash[60031][contextoGeral];
        let urbanizacaoBrasil$ = this.getValorIndicador(10058, 60031, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60031, this.localidade.codigo, resultado.ano));

        esgotamentoSanitarioUF$.zip(esgotamentoSanitarioBrasil$, arborizacaoUF$, arborizacaoBrasil$, urbanizacaoUF$, urbanizacaoBrasil$)
            .subscribe(([esgotamentoSanitarioUF, esgotamentoSanitarioBrasil, arborizacaoUF, arborizacaoBrasil, urbanizacaoUF, urbanizacaoBrasil]) => {

        this.textoMeioAmbiente = `${this.localidade.nome} tem ${esgotamentoSanitarioUF.res}% de domicilios com esgotamento sanitário adequado, 
                ${arborizacaoUF.res}% dos domicilios urbanos em vias publicas com arborização e 
                ${urbanizacaoUF.res}% dos domicílios urbanos em vias públicas com urbanização adequada (presença de bueiro, calçada, pavimentação e meio-fio). 
                Quando comparado com os outros municípios de ${this.localidade.parent.sigla}, fica posicionado em ${esgotamentoSanitarioUF.ranking} de ${universoLocal}, 
                ${arborizacaoUF.ranking} de ${universoLocal} e ${urbanizacaoUF.ranking} de ${universoLocal} respectiviamente. 
                Já quando comparado a outros municípios do Brasil, sua posição é ${esgotamentoSanitarioBrasil.ranking} de ${universoGeral}, 
                ${arborizacaoBrasil.ranking} de ${universoGeral} e 
                ${urbanizacaoBrasil.ranking} de ${universoGeral} respectivamente.`;
        });


        // Texto ECONOMIA

        // const pipPerCaptaUF = hash[60047][contextoLocal];
        let pipPerCaptaUF$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const pipPerCaptaBrasil = hash[60047][contextoGeral];
        let pipPerCaptaBrasil$ = this.getValorIndicador(10058, 60047, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60047, this.localidade.codigo, resultado.ano));

        // const receitasFontesExternasUF = hash[60048][contextoLocal];
        let receitasFontesExternasUF$ = this.getValorIndicador(10058, 60048, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60048, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const receitasFontesExternasBrasil = hash[60048][contextoGeral];
        let receitasFontesExternasBrasil$ = this.getValorIndicador(10058, 60048, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60048, this.localidade.codigo, resultado.ano));

        pipPerCaptaUF$.zip(pipPerCaptaBrasil$, receitasFontesExternasUF$, receitasFontesExternasBrasil$)
            .subscribe(([pipPerCaptaUF, pipPerCaptaBrasil, receitasFontesExternasUF, receitasFontesExternasBrasil]) => {

        this.textoEconomia = `Em ${pipPerCaptaUF.periodo}, ${this.localidade.nome} tinha PIB per capita de R$ ${pipPerCaptaUF.res}. 
            Comparado aos demais municípios do estado, se posicionava entre em ${pipPerCaptaUF.ranking} de ${universoLocal}. 
            E quando comparado a outros municípios do Brasil, essa colocação é ${pipPerCaptaBrasil.ranking} de ${universoGeral}. 
            ${this.localidade.nome} tinha em ${receitasFontesExternasUF.periodo}, ${receitasFontesExternasUF.res}% do seu orçamento proveniente de fontes externas. 
            Em compração aos outros municípios de ${this.localidade.parent.sigla}, está em ${receitasFontesExternasUF.ranking} de ${universoLocal} 
            e quando comparado a municípios no Brasil todo, fica em ${receitasFontesExternasBrasil.ranking} de ${universoGeral}.`;
        });


        // Texto SAUDE
        // const mortaldadeInfantilUF = hash[30279][contextoLocal];
        let mortaldadeInfantilUF$ = this.getValorIndicador(39, 30279, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(39, 30279, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const mortaldadeInfantilBrasil = hash[30279][contextoGeral];
        let mortaldadeInfantilBrasil$ = this.getValorIndicador(39, 30279, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(39, 30279, this.localidade.codigo, resultado.ano));

        // const intermacoesDiarreiaUF = hash[60032][contextoLocal];
        let intermacoesDiarreiaUF$ = this.getValorIndicador(10058, 60032, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60032, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const internacoesDiarreiaBrasil = hash[60032][contextoGeral];
        let internacoesDiarreiaBrasil$ = this.getValorIndicador(10058, 60032, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60032, this.localidade.codigo, resultado.ano));

        mortaldadeInfantilUF$.zip(mortaldadeInfantilBrasil$, intermacoesDiarreiaUF$, internacoesDiarreiaBrasil$)
            .subscribe(([mortaldadeInfantilUF, mortaldadeInfantilBrasil, intermacoesDiarreiaUF, internacoesDiarreiaBrasil]) => {

        this.textoSaude = `A taxa de mortalidade infantil média no município é de ${mortaldadeInfantilUF.res} para 1.000 nascidos vivos. 
            As internações devido a diarréias são de ${intermacoesDiarreiaUF.res} para cada 1.000 habitantes. 
            Comparado com todos os municípios do estado, posiciona-se em ${mortaldadeInfantilUF.ranking} de ${universoLocal} e 
            ${intermacoesDiarreiaUF.ranking} de ${universoLocal} respectivamente. 
            Quando comparado a municípios no Brasil essas posições são de ${mortaldadeInfantilBrasil.ranking} de ${universoGeral} e 
            ${internacoesDiarreiaBrasil.ranking} de ${universoGeral}.`;
        });


        // Texto EDUCAÇÃO
        // const idebAnosIniciaisUF = hash[60041][contextoLocal];
        let idebAnosIniciaisUF$ = this.getValorIndicador(10058, 60041, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60041, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const idebAnosIniciaisBrasil = hash[60041][contextoGeral];
        let idebAnosIniciaisBrasil$ = this.getValorIndicador(10058, 60041, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60041, this.localidade.codigo, resultado.ano));

        // const idebAnosFinaisUF = hash[60042][contextoLocal];
        let idebAnosFinaisUF$ = this.getValorIndicador(10058, 60042, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60042, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const idebAnosFinaisBrasil = hash[60042][contextoGeral];
        let idebAnosFinaisBrasil$ = this.getValorIndicador(10058, 60042, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60042, this.localidade.codigo, resultado.ano));

        // const taxaEscolarizacao6A14AnosUF = hash[60045][contextoLocal];
        let taxaEscolarizacao6A14AnosUF$ = this.getValorIndicador(10058, 60045, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60045, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // const taxaEscolarizacao6A14AnosBrasil = hash[60045][contextoGeral];
        let taxaEscolarizacao6A14AnosBrasil$ = this.getValorIndicador(10058, 60045, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(10058, 60045, this.localidade.codigo, resultado.ano));

        idebAnosIniciaisUF$.zip(idebAnosIniciaisBrasil$, idebAnosFinaisUF$, idebAnosFinaisBrasil$, taxaEscolarizacao6A14AnosUF$, taxaEscolarizacao6A14AnosBrasil$)
            .subscribe(([idebAnosIniciaisUF, idebAnosIniciaisBrasil, idebAnosFinaisUF, idebAnosFinaisBrasil, taxaEscolarizacao6A14AnosUF, taxaEscolarizacao6A14AnosBrasil]) => {

        this.textoEducacao = `Em ${idebAnosIniciaisBrasil.periodo}, os alunos dos anos inicias da rede pública do município, 
        tiveram nota média de ${idebAnosIniciaisBrasil.res} no IDEB. 
        Para os alunos dos anos finais essa nota foi de ${idebAnosFinaisBrasil.res}. 
        Comparados aos municíos do mesmo estado, a nota dos alunos dos anos inciais coloca o município em ${idebAnosIniciaisUF.ranking} de ${universoLocal}. 
        Para a nota dos alunos dos anos finais, a posição é de ${idebAnosFinaisUF.ranking} de ${universoLocal}. 
        Quanto a taxa de escolarização (para pessoas de 6 a 14 anos), esta foi de ${taxaEscolarizacao6A14AnosBrasil.res} em ${taxaEscolarizacao6A14AnosBrasil.periodo}. 
        Isso posiciona o município em ${taxaEscolarizacao6A14AnosUF.ranking} de ${universoLocal} do ${this.localidade.parent.sigla} e 
        em ${taxaEscolarizacao6A14AnosBrasil.ranking} de ${universoGeral} no Brasil.`;
         });


    }

    public goToTop(tema): void {
        let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, tema);
        this.pageScrollService.start(pageScrollInstance);
    };
}