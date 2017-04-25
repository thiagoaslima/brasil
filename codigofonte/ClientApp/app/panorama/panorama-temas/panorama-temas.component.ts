import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChanges, ViewChild, ElementRef, Inject } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal';

import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { GraficoConfiguration, PanoramaConfigurationItem, PanoramaDescriptor, PanoramaItem, PanoramaVisualizacao } from '../configuration/panorama.model';
import { TEMAS } from '../configuration/panorama.configuration';
import { Localidade } from '../../shared2/localidade/localidade.model';
import { IndicadorService2 } from '../../shared2/indicador/indicador.service';
import { Indicador, EscopoIndicadores } from '../../shared2/indicador/indicador.model';
import { Resultado } from '../../shared2/resultado/resultado.model';

import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare var document: any;


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
    textoPopulacao = "";

    isBrowser = isBrowser;

    constructor(
        private _indicadorService: IndicadorService2,
        private pageScrollService: PageScrollService,
    ) { }

    public getTextoAnalitico(nomeTema) {
        
        if (nomeTema === TEMAS.populacao) {
            return Observable.of(this.textoPopulacao);
        }

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
        // if(this.isBrowser){
        //     this.goToTema();
        // }
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.temas && changes.temas.currentValue && changes.temas.currentValue.length > 0) {
            this.localidade = changes.temas.currentValue[0].localidade;
            this.configurarTextosTemas();
        }
        if(this.isBrowser){
            this.goToTema();
        }
    }

    private getPosicaoIndicador(idPesquisa: number, indicador: number, codigoLocalidade: number, periodo: string, contexto: string = 'BR'): Observable<any> {
        return this._indicadorService.getPosicaoRelativa(idPesquisa, indicador, periodo, codigoLocalidade, contexto)
    }


    private getValorIndicador(idPesquisa: number, indicador: number, codigoLocalidade: number): Observable<any> {

        return this._indicadorService.getIndicadoresById(idPesquisa, indicador, EscopoIndicadores.proprio, codigoLocalidade)
            .switchMap(indicadores => indicadores[0].getResultadoByLocal(this.localidade.codigo))
            .map(resultado => {
                if (!resultado) {
                     return {
                        "valor": '-',
                        "ano": ''
                    }
                }
                return {
                    "valor": resultado.valorValidoMaisRecente,
                    "ano": resultado.periodoValidoMaisRecente
                }
            });
    }

    public goToTema(): void {

        if(this.isBrowser){
            let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(document, this.temaSelecionado && this.temaSelecionado.toString());
            this.pageScrollService.start(pageScrollInstance);
        }
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


        // Texto POPULAÇÂO
        // 
        let populacaoUF$ = this.getValorIndicador(33, 29166, this.localidade.codigo)
             .flatMap(resultado => this.getPosicaoIndicador(33, 29166, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // 
        let populacaoBrasil$ = this.getValorIndicador(33, 29166, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(33, 29166, this.localidade.codigo, resultado.ano));
            
        // 
        let densidadeUF$ = this.getValorIndicador(33, 29168, this.localidade.codigo)
             .flatMap(resultado => this.getPosicaoIndicador(33, 29168, this.localidade.codigo, resultado.ano, this.localidade.parent.codigo.toString()));

        // 
        let densidadeBrasil$ = this.getValorIndicador(33, 29168, this.localidade.codigo)
            .flatMap(resultado => this.getPosicaoIndicador(33, 29168, this.localidade.codigo, resultado.ano));   
            
        populacaoUF$.zip(populacaoBrasil$, densidadeUF$, densidadeBrasil$)
           .subscribe(([populacaoUF, populacaoBrasil, densidadeUF, densidadeBrasil]) => {

        this.textoPopulacao = `
        
        O município tinha ${populacaoUF.res} habitantes no último Censo. Isso coloca o município na posição ${populacaoUF.ranking} dentre ${universoLocal} do mesmo estado. Em comparação com outros municípios do Brasil, fica na posição ${populacaoBrasil.ranking} dentre ${universoGeral}. Sua densidade demográfica é de ${densidadeUF.res} habitantes por kilometro quadrado, colocando-o na posição ${densidadeUF.ranking} de ${universoLocal} do mesmo estado. Quando comparado com outros municípios no Brasil, fica na posição ${densidadeBrasil.ranking} de ${universoGeral}.`;
        });

        //Texto TRABALHO
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

        this.textoTrabalho = `
        Em ${salarioMedioMensalUF.periodo}, o salário médio mensal era de ${salarioMedioMensalUF.res} salários mínimos. A proporção de pessoas ocupadas em relação à população total era de ${pessoasOcupadasUF.res}%. 
        
        Na comparação com os outros municípios do estado, ocupava as posições ${salarioMedioMensalUF.ranking} de ${universoLocal} e ${pessoasOcupadasUF.ranking} de ${universoLocal}, respectivamente. 
        
        Já na comparação com municípios do Brasil todo, ficava na posição ${salarioMedioMensalBrasil.ranking} de ${universoGeral} e ${pessoasOcupadasBrasil.ranking} de ${universoGeral}, respectivamente.
        
        Considerando domicílios com rendimentos mensais de até meio salário mínimo por pessoa, tinha ${rendimentoMensalUF.res}% da população nessas condições, o que o colocava na posição ${rendimentoMensalUF.ranking} de ${universoLocal} dentre os municípios do estado e na posição ${rendimentoMensalBrasil.ranking} de ${universoGeral} dentre os municípios do Brasil.`;
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

        this.textoMeioAmbiente = `
        
        Apresenta ${esgotamentoSanitarioUF.res}% de domicílios com esgotamento sanitário adequado, ${arborizacaoUF.res}% de domicílios urbanos em vias públicas com arborização e  ${urbanizacaoUF.res}% de domicílios urbanos em vias públicas com urbanização adequada (presença de bueiro, calçada, pavimentação e meio-fio). Quando comparado com os outros municípios do estado, fica na posição ${esgotamentoSanitarioUF.ranking} de ${universoLocal}, ${arborizacaoUF.ranking} de ${universoLocal} e ${urbanizacaoUF.ranking} de ${universoLocal}, respectivamente. 
                
        Já quando comparado a outros municípios do Brasil, sua posição é ${esgotamentoSanitarioBrasil.ranking} de ${universoGeral}, 
                ${arborizacaoBrasil.ranking} de ${universoGeral} e 
                ${urbanizacaoBrasil.ranking} de ${universoGeral}, respectivamente.`;
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

        this.textoEconomia = `
        
        
        Em ${pipPerCaptaUF.periodo}, tinha um PIB per capita de R$ ${pipPerCaptaUF.res}. Na comparação com os demais municípios do estado, sua posição era de ${pipPerCaptaUF.ranking} de ${universoLocal}. Já na comparação com municípios do Brasil todo, sua colocação era de ${pipPerCaptaBrasil.ranking} de ${universoGeral}. 
        
        Em ${receitasFontesExternasUF.periodo}, tinha ${receitasFontesExternasUF.res}% do seu orçamento proveniente de fontes externas. Em comparação aos outros municípios do estado, estava na posição ${receitasFontesExternasUF.ranking} de ${universoLocal} e, quando comparado a municípios do Brasil todo, ficava em ${receitasFontesExternasBrasil.ranking} de ${universoGeral}.`;
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

        this.textoSaude = `
        
        A taxa de mortalidade infantil média no município é de ${mortaldadeInfantilUF.res} para 1.000 nascidos vivos. As internações devido a diarreias são de ${intermacoesDiarreiaUF.res} para cada 1.000 habitantes. Comparado com todos os municípios do estado, fica nas posições ${mortaldadeInfantilUF.ranking} de ${universoLocal} e 
            ${intermacoesDiarreiaUF.ranking} de ${universoLocal}, respectivamente. 
            
            Quando comparado a municípios do Brasil todo, essas posições são de ${mortaldadeInfantilBrasil.ranking} de ${universoGeral} e 
            ${internacoesDiarreiaBrasil.ranking} de ${universoGeral}, respectivamente.`;
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

        this.textoEducacao = `
        
        Em ${idebAnosIniciaisBrasil.periodo}, os alunos dos anos inicias da rede pública do município tiveram nota média de ${idebAnosIniciaisBrasil.res} no IDEB. Para os alunos dos anos finais, essa nota foi de ${idebAnosFinaisBrasil.res}. 
        
        Na comparação com municípios do mesmo estado, a nota dos alunos dos anos iniciais colocava este município na posição ${idebAnosIniciaisUF.ranking} de ${universoLocal}. 
        
        Considerando a nota dos alunos dos anos finais, a posição passava a ${idebAnosFinaisUF.ranking} de ${universoLocal}. 
        
        A taxa de escolarização (para pessoas de 6 a 14 anos) foi de ${taxaEscolarizacao6A14AnosBrasil.res} em ${taxaEscolarizacao6A14AnosBrasil.periodo}. 
        
        Isso posicionava o município na posição ${taxaEscolarizacao6A14AnosUF.ranking} de ${universoLocal} dentre os municípios do estado e na posição ${taxaEscolarizacao6A14AnosBrasil.ranking} de ${universoGeral} dentre os municípios do Brasil.`;
         });


    }

    public goToTop(tema): void {
        if(this.isBrowser && !!document){
            let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(document, tema);
            this.pageScrollService.start(pageScrollInstance);
        }
    };
}