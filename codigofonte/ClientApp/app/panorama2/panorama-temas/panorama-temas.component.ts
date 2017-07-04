import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal';
import { PageScrollInstance, PageScrollService } from 'ng2-page-scroll';

import { TiposGrafico } from '../../infografia/grafico-base/grafico.values';
import { ItemConfiguracao, TEMAS, dadosGrafico, dadosPainel } from "../configuration";
import { Panorama2Service } from '../panorama.service';
import { ResultadoPipe } from '../../shared/resultado.pipe';
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

    private _extrairDadosIndicador(indicadorId) {
        return {
            periodo: this.resultados[indicadorId].periodoValidoMaisRecente,
            res: this.resultados[indicadorId].valorValidoMaisRecente,
            rankingLocal: this.rankings[indicadorId]['local']['posicao'],
            rankingGeral: this.rankings[indicadorId]['BR']['posicao']
        }
    }

    private _isDadosIndicadorValidos(indicadorId) {
        return this.resultados[indicadorId]
                && this.resultados[indicadorId].periodoValidoMaisRecente
                && this.resultados[indicadorId].valorValidoMaisRecente
                && this.rankings[indicadorId]['local']['posicao']
                && this.rankings[indicadorId]['BR']['posicao'];
    }

    private _textos = {
        [TEMAS.trabalho.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            if( !(this._isDadosIndicadorValidos(29765)
                && this._isDadosIndicadorValidos(60036)
                && this._isDadosIndicadorValidos(60037))
            ) {
                return '';
            }

            let salarioMedio = this._extrairDadosIndicador(29765);
            let pessoasOcupadas = this._extrairDadosIndicador(60036);
            let rendimento = this._extrairDadosIndicador(60037);

            return `
                Em ${salarioMedio.periodo}, o salário médio mensal era de ${salarioMedio.res} salários mínimos. 
                A proporção de pessoas ocupadas em relação à população total era de ${pessoasOcupadas.res}%. 
                Na comparação com os outros municípios do estado, ocupava as posições ${salarioMedio.rankingLocal} de ${universoLocal} e ${pessoasOcupadas.rankingLocal} de ${universoLocal}, respectivamente. 
                Já na comparação com cidades do país todo, ficava na posição ${salarioMedio.rankingGeral} de ${universoGeral} e ${pessoasOcupadas.rankingGeral} de ${universoGeral}, respectivamente.
                Considerando domicílios com rendimentos mensais de até meio salário mínimo por pessoa, tinha ${rendimento.res}% da população nessas condições, o que o colocava na posição ${rendimento.rankingLocal} de ${universoLocal} dentre as cidades do estado e na posição ${rendimento.rankingGeral} de ${universoGeral} dentre as cidades do Brasil.
            `;
        },

        [TEMAS.populacao.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            if( !(this._isDadosIndicadorValidos(29166)
                && this._isDadosIndicadorValidos(29168))
            ) {
                return '';
            }

            let populacao = this._extrairDadosIndicador(29166);
            let densidade = this._extrairDadosIndicador(29168);

            return `
                A cidade tinha uma população de ${populacao.res} habitantes no último Censo. 
                Isso coloca a cidade na posição ${populacao.rankingLocal} dentre ${universoLocal} do mesmo estado. 
                Em comparação com outros municípios do país, fica na posição ${populacao.rankingGeral} dentre ${universoGeral}. 
                Sua densidade demográfica é de ${densidade.res} habitantes por kilometro quadrado, colocando-o na posição ${densidade.rankingLocal} de ${universoLocal} do mesmo estado. 
                Quando comparado com outras cidades no Brasil, fica na posição ${densidade.rankingGeral} de ${universoGeral}.
            `
        },

        [TEMAS.meioAmbiente.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            if( !(this._isDadosIndicadorValidos(60030)
                && this._isDadosIndicadorValidos(60029)
                && this._isDadosIndicadorValidos(60031))
            ) {
                return '';
            }

            let esgotamento = this._extrairDadosIndicador(60030);
            let arborizacao = this._extrairDadosIndicador(60029);
            let urbanizacao = this._extrairDadosIndicador(60031);

            return `
                Apresenta ${esgotamento.res}% de domicílios com esgotamento sanitário adequado, ${arborizacao.res}% de domicílios urbanos em vias públicas com arborização e ${urbanizacao.res}% de domicílios urbanos em vias públicas com urbanização adequada (presença de bueiro, calçada, pavimentação e meio-fio). 
                Quando comparado com os outros municípios do estado, fica na posição ${esgotamento.rankingLocal} de ${universoLocal}, ${arborizacao.rankingLocal} de ${universoLocal} e ${urbanizacao.rankingLocal} de ${universoLocal}, respectivamente. 
                Já quando comparado a outras cidades do Brasil, sua posição é ${esgotamento.rankingGeral} de ${universoGeral}, ${arborizacao.rankingGeral} de ${universoGeral} e ${urbanizacao.rankingGeral} de ${universoGeral}, respectivamente.
            `;
        },

        [TEMAS.economia.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            if( !(this._isDadosIndicadorValidos(60047)
                && this._isDadosIndicadorValidos(60048))
            ) {
                return '';
            }

            let pib = this._extrairDadosIndicador(60047);
            let receitas = this._extrairDadosIndicador(60048);

            return `
                Em ${pib.periodo}, tinha um PIB per capita de R$ ${pib.res}. 
                Na comparação com os demais municípios do estado, sua posição era de ${pib.rankingLocal} de ${universoLocal}. 
                Já na comparação com cidades do Brasil todo, sua colocação era de ${pib.rankingGeral} de ${universoGeral}. 
                Em ${receitas.periodo}, tinha ${receitas.res}% do seu orçamento proveniente de fontes externas. 
                Em comparação às outras cidades do estado, estava na posição ${receitas.rankingLocal} de ${universoLocal} e, quando comparado a cidades do Brasil todo, ficava em ${receitas.rankingGeral} de ${universoGeral}.
            `;
        },

        [TEMAS.saude.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            if( !(this._isDadosIndicadorValidos(30279)
                && this._isDadosIndicadorValidos(60032))
            ) {
                return '';
            }

            let mortalidade = this._extrairDadosIndicador(30279);
            let internacoes = this._extrairDadosIndicador(60032);

            return `
                A taxa de mortalidade infantil média na cidade é de ${mortalidade.res} para 1.000 nascidos vivos. 
                As internações devido a diarreias são de ${internacoes.res} para cada 1.000 habitantes. 
                Comparado com todos os municípios do estado, fica nas posições ${mortalidade.rankingLocal} de ${universoLocal} e ${internacoes.rankingLocal} de ${universoLocal}, respectivamente. 
                Quando comparado a cidades do Brasil todo, essas posições são de ${mortalidade.rankingGeral} de ${universoGeral} e ${internacoes.rankingGeral} de ${universoGeral}, respectivamente.
            `;
        },

        [TEMAS.educacao.label]: () => {
            const universoLocal = this.localidade.parent.children.length;
            const universoGeral = 5570;

            if( !(this._isDadosIndicadorValidos(60041)
                && this._isDadosIndicadorValidos(60042)
                && this._isDadosIndicadorValidos(60045))
            ) {
                return '';
            }

            let idebInicial = this._extrairDadosIndicador(60041);
            let idebFinal = this._extrairDadosIndicador(60042);
            let escolarizacao = this._extrairDadosIndicador(60045);

            return `
                Em ${idebInicial.periodo}, os alunos dos anos inicias da rede pública da cidade tiveram nota média de ${idebInicial.res} no IDEB. 
                Para os alunos dos anos finais, essa nota foi de ${idebFinal.res}. 
                Na comparação com cidades do mesmo estado, a nota dos alunos dos anos iniciais colocava esta cidade na posição ${idebInicial.rankingLocal} de ${universoLocal}. 
                Considerando a nota dos alunos dos anos finais, a posição passava a ${idebFinal.rankingLocal} de ${universoLocal}. 
                A taxa de escolarização (para pessoas de 6 a 14 anos) foi de ${escolarizacao.res} em ${escolarizacao.periodo}. 
                Isso posicionava o município na posição ${escolarizacao.rankingLocal} de ${universoLocal} dentre as cidades do estado e na posição ${escolarizacao.rankingGeral} de ${universoGeral} dentre as cidades do Brasil.
            `;
        }

    }


}