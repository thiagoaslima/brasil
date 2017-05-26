import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal';
import { PageScrollInstance, PageScrollService } from 'ng2-page-scroll';

import { TiposGrafico } from '../../infografia/grafico-base/grafico.values';
import { ItemConfiguracao, TEMAS, dadosGrafico, dadosPainel } from "../configuration";
import { Panorama2Service } from '../panorama.service';
import { Ranking } from '../../shared2/indicador/indicador.model';
import { Localidade, Resultado } from "../../shared3/models";
import { converterObjArrayEmHash } from "../../utils2";

@Component({
    selector: 'panorama-temas',
    templateUrl: './panorama-temas.template.html',
    styleUrls: ['./panorama-temas.style.css']
})
export class PanoramaTemasComponent implements OnInit, OnChanges {
    @Input() configuracao: ItemConfiguracao[] = [];
    @Input() localidade: Localidade = null;
    @Input() temaSelecionado: String = '';

    public temas = [] as Array<{ tema: string, painel: dadosPainel[], graficos: dadosGrafico[] }>;
    public textos = {};
    private resultados = {} as { [indicadorId: number]: Resultado };
    private rankings = {} as { [indicadorId: number]: { [contexto: string]: any } };

    public isPrerender = isNode;
    public isBrowser = isBrowser;

    constructor(
        private _panoramaService: Panorama2Service,
        private pageScrollService: PageScrollService
    ) { }

    ngOnInit() {
        
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (
            changes.hasOwnProperty('configuracao') && changes.configuracao.currentValue && changes.configuracao.currentValue.length > 0 ||
            changes.hasOwnProperty('localidade') && changes.localidade.currentValue &&
            this.localidade && this.configuracao && this.configuracao.length > 0
        ) {
            debugger;
            this._panoramaService.getTemas(this.configuracao, this.localidade).toPromise().then(resp => {
                this.temas = resp.configuracao;
                this.resultados = resp.resultados;
                this.rankings = resp.rankings;
                this.atualizaTextos();
            })
        }

        if (this.isBrowser) {
            this.goToTema();
        }
    } 

    public goToTema(): void {
        if (this.isBrowser) {
            let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(document, this.temaSelecionado && this.temaSelecionado.toString());
            this.pageScrollService.start(pageScrollInstance);
        }
    };

   private atualizaTextos(): void {
        this.temas.forEach(({tema}) => this.textos[tema] = this._textos[tema]() || '');
    }

    private _textos = {
        [TEMAS.trabalho.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            let salarioMedio = {
                periodo: this.resultados[29765].periodoValidoMaisRecente,
                res: this.resultados[29765].valorValidoMaisRecente,
                rankingLocal: this.rankings[29765][this.localidade.parent.codigo],
                rankingGeral: this.rankings[29765]['BR']
            }
            let pessoasOcupadas = {
                periodo: this.resultados[60036].periodoValidoMaisRecente,
                res: this.resultados[60036].valorValidoMaisRecente,
                rankingLocal: this.rankings[60036][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60036]['BR']
            }
            let rendimento = {
                periodo: this.resultados[60037].periodoValidoMaisRecente,
                res: this.resultados[60037].valorValidoMaisRecente,
                rankingLocal: this.rankings[60037][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60037]['BR']
            }

            return `
                Em ${salarioMedio.periodo}, o salário médio mensal era de ${salarioMedio.res} salários mínimos. 
                A proporção de pessoas ocupadas em relação à população total era de ${pessoasOcupadas.res}%. 
                Na comparação com os outros municípios do estado, ocupava as posições ${salarioMedio.rankingLocal} de ${universoLocal} e ${pessoasOcupadas.rankingLocal} de ${universoLocal}, respectivamente. 
                Já na comparação com municípios do Brasil todo, ficava na posição ${salarioMedio.rankingGeral} de ${universoGeral} e ${pessoasOcupadas.rankingGeral} de ${universoGeral}, respectivamente.
                Considerando domicílios com rendimentos mensais de até meio salário mínimo por pessoa, tinha ${rendimento.res}% da população nessas condições, o que o colocava na posição ${rendimento.rankingLocal} de ${universoLocal} dentre os municípios do estado e na posição ${rendimento.rankingGeral} de ${universoGeral} dentre os municípios do Brasil.
            `;
        },

        [TEMAS.populacao.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            let populacao = {
                periodo: this.resultados[29166].periodoValidoMaisRecente,
                res: this.resultados[29166].valorValidoMaisRecente,
                rankingLocal: this.rankings[29166][this.localidade.parent.codigo],
                rankingGeral: this.rankings[29166]['BR']
            }
            let densidade = {
                periodo: this.resultados[29168].periodoValidoMaisRecente,
                res: this.resultados[29168].valorValidoMaisRecente,
                rankingLocal: this.rankings[29168][this.localidade.parent.codigo],
                rankingGeral: this.rankings[29168]['BR']
            }

            return `
                O município tinha ${populacao.res} habitantes no último Censo. 
                Isso coloca o município na posição ${populacao.rankingLocal} dentre ${universoLocal} do mesmo estado. 
                Em comparação com outros municípios do Brasil, fica na posição ${populacao.rankingGeral} dentre ${universoGeral}. 
                Sua densidade demográfica é de ${densidade.res} habitantes por kilometro quadrado, colocando-o na posição ${densidade.rankingLocal} de ${universoLocal} do mesmo estado. 
                Quando comparado com outros municípios no Brasil, fica na posição ${densidade.rankingGeral} de ${universoGeral}.
            `
        },

        [TEMAS.meioAmbiente.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            let esgotamento = {
                periodo: this.resultados[60030].periodoValidoMaisRecente,
                res: this.resultados[60030].valorValidoMaisRecente,
                rankingLocal: this.rankings[60030][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60030]['BR']
            }
            let arborizacao = {
                periodo: this.resultados[60029].periodoValidoMaisRecente,
                res: this.resultados[60029].valorValidoMaisRecente,
                rankingLocal: this.rankings[60029][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60029]['BR']
            }
            let urbanizacao = {
                periodo: this.resultados[60031].periodoValidoMaisRecente,
                res: this.resultados[60031].valorValidoMaisRecente,
                rankingLocal: this.rankings[60031][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60031]['BR']
            }

            return `
                Apresenta ${esgotamento.res}% de domicílios com esgotamento sanitário adequado, ${arborizacao.res}% de domicílios urbanos em vias públicas com arborização e ${urbanizacao.res}% de domicílios urbanos em vias públicas com urbanização adequada (presença de bueiro, calçada, pavimentação e meio-fio). 
                Quando comparado com os outros municípios do estado, fica na posição ${esgotamento.rankingLocal} de ${universoLocal}, ${arborizacao.rankingLocal} de ${universoLocal} e ${urbanizacao.rankingLocal} de ${universoLocal}, respectivamente. 
                Já quando comparado a outros municípios do Brasil, sua posição é ${esgotamento.rankingGeral} de ${universoGeral}, ${arborizacao.rankingGeral} de ${universoGeral} e ${urbanizacao.rankingGeral} de ${universoGeral}, respectivamente.
            `;
        },

        [TEMAS.economia.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            let pib = {
                periodo: this.resultados[60047].periodoValidoMaisRecente,
                res: this.resultados[60047].valorValidoMaisRecente,
                rankingLocal: this.rankings[60047][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60047]['BR']
            }
            let receitas = {
                periodo: this.resultados[60048].periodoValidoMaisRecente,
                res: this.resultados[60048].valorValidoMaisRecente,
                rankingLocal: this.rankings[60048][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60048]['BR']
            }

            return `
                Em ${pib.periodo}, tinha um PIB per capita de R$ ${pib.res}. 
                Na comparação com os demais municípios do estado, sua posição era de ${pib.rankingLocal} de ${universoLocal}. 
                Já na comparação com municípios do Brasil todo, sua colocação era de ${pib.rankingGeral} de ${universoGeral}. 
                Em ${receitas.periodo}, tinha ${receitas.res}% do seu orçamento proveniente de fontes externas. 
                Em comparação aos outros municípios do estado, estava na posição ${receitas.rankingLocal} de ${universoLocal} e, quando comparado a municípios do Brasil todo, ficava em ${receitas.rankingGeral} de ${universoGeral}.
            `;
        },

        [TEMAS.saude.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            let mortalidade = {
                periodo: this.resultados[30279].periodoValidoMaisRecente,
                res: this.resultados[30279].valorValidoMaisRecente,
                rankingLocal: this.rankings[30279][this.localidade.parent.codigo],
                rankingGeral: this.rankings[30279]['BR']
            }
            let internacoes = {
                periodo: this.resultados[60032].periodoValidoMaisRecente,
                res: this.resultados[60032].valorValidoMaisRecente,
                rankingLocal: this.rankings[60032][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60032]['BR']
            }

            return `
                A taxa de mortalidade infantil média no município é de ${mortalidade.res} para 1.000 nascidos vivos. 
                As internações devido a diarreias são de ${internacoes.res} para cada 1.000 habitantes. 
                Comparado com todos os municípios do estado, fica nas posições ${mortalidade.rankingLocal} de ${universoLocal} e ${internacoes.rankingLocal} de ${universoLocal}, respectivamente. 
                Quando comparado a municípios do Brasil todo, essas posições são de ${mortalidade.rankingGeral} de ${universoGeral} e ${internacoes.rankingGeral} de ${universoGeral}, respectivamente.
            `;
        },

        [TEMAS.educacao.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            let idebInicial = {
                periodo: this.resultados[60041].periodoValidoMaisRecente,
                res: this.resultados[60041].valorValidoMaisRecente,
                rankingLocal: this.rankings[60041][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60041]['BR']
            }
            let idebFinal = {
                periodo: this.resultados[60042].periodoValidoMaisRecente,
                res: this.resultados[60042].valorValidoMaisRecente,
                rankingLocal: this.rankings[60042][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60042]['BR']
            }
            let escolarizacao = {
                periodo: this.resultados[60045].periodoValidoMaisRecente,
                res: this.resultados[60045].valorValidoMaisRecente,
                rankingLocal: this.rankings[60045][this.localidade.parent.codigo],
                rankingGeral: this.rankings[60045]['BR']
            }

            return `
                Em ${idebInicial.periodo}, os alunos dos anos inicias da rede pública do município tiveram nota média de ${idebInicial.res} no IDEB. 
                Para os alunos dos anos finais, essa nota foi de ${idebFinal.res}. 
                Na comparação com municípios do mesmo estado, a nota dos alunos dos anos iniciais colocava este município na posição ${idebInicial.rankingLocal} de ${universoLocal}. 
                Considerando a nota dos alunos dos anos finais, a posição passava a ${idebFinal.rankingLocal} de ${universoLocal}. 
                A taxa de escolarização (para pessoas de 6 a 14 anos) foi de ${escolarizacao.res} em ${escolarizacao.periodo}. 
                Isso posicionava o município na posição ${escolarizacao.rankingLocal} de ${universoLocal} dentre os municípios do estado e na posição ${escolarizacao.rankingGeral} de ${universoGeral} dentre os municípios do Brasil.
            `;
        }

    }


}