import { Component, OnInit, Output, Input, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

import { SinteseService } from '../../sintese/sintese.service';
import {
    TraducaoService,
    escopoIndicadores,
    Localidade,
    Pesquisa,
    LocalidadeService3,
    PesquisaService3,
    IndicadorService3,
    RouterParamsService,
    AnalyticsService
} from "../../../shared/";
import { ModalErrorService } from '../../../core/';


// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
const FileSaver = require('file-saver');
const json2csv = require('json2csv');

@Component({
    selector: 'pesquisa-tabela',
    templateUrl: './pesquisa-tabela.template.html',
    styleUrls: ['./pesquisa-tabela.style.css']
})

export class PesquisaTabelaComponent implements OnChanges {

    @Input() localidades: number[];
    @Input() pesquisa: Pesquisa;
    @Input() posicaoIndicador: string;
    @Input() periodo: string;
    @Input('ocultarValoresVazios') isOcultarValoresVazios: boolean = true;

    @Output() onEmpty = new EventEmitter();

    public indicadores;
    public isVazio;
    public exclusiva;
    public periodosValidos: string[];

    public idIndicadorSelecionado;

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        // TODO: Retirar SinteseService e usar PesquisaService e/ou IndicadrService
        private _sintese: SinteseService,
        private _routerParamsService: RouterParamsService,
        private _indicadorService: IndicadorService3,
        private _localidadeService: LocalidadeService3,
        private _router: Router,
        private _route: ActivatedRoute,
        private _pesquisaService: PesquisaService3,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService,
        private _analyticsService: AnalyticsService
    ) {  }

    ngOnChanges() {

        if(this.pesquisa && this.localidades && this.localidades.length > 0){

            // verifica se a pesquisa é exclusiva para estados (código dos estados vai de 0 a 99, maior que isso é um município)
            if(this.localidades.length > 0 && this.localidades[0] > 99 &&
                this.pesquisa['contexto'] && this.pesquisa['contexto'].municipio == false){
                this.exclusiva = true;
            }

            this.indicadores = null;

            let localidade2: string = !this.localidades[1] ? undefined : this.localidades[1].toString();
            let localidade3: string = !this.localidades[2] ? undefined : this.localidades[2].toString();

            let periodoPesquisado = this._pesquisaService.isPesquisaComIndicadoresQueVariamComAno(this.pesquisa['id']) ? this.periodo : 'all';

            let subscription$$ = this._sintese.getPesquisaLocalidades(this.pesquisa['id'], this.localidades[0].toString(), localidade2, localidade3, this.posicaoIndicador, escopoIndicadores.arvoreCompleta, periodoPesquisado).subscribe((indicadores) => {

                this.indicadores = this.flat(indicadores);

                this.periodosValidos = this.getPeriodosValidos(this.indicadores);

                if(!this.isPeriodoSelecionadoValido() && this.periodosValidos.length > 0){

                    this.selecionarPeriodoValidoMaisRecente();
                }

                this.isVazio = true;
                //cria algumas propriedades nos indicadores para contralor sua exibição/interação
                for(let i = 0; i < this.indicadores.length; i++){
                    let indicador = this.indicadores[i];
                    indicador.nivel = this.getNivelIndicador(indicador.posicao);
                    indicador.visivel = indicador.nivel <= 4 || (indicador.parent && indicador.parent.visivel && !this.hasValue(indicador.parent, this.periodo)) ? true : false;
                    indicador.isVazio = !this.hasAnyValue(indicador, this.periodo);
                    if(!indicador.isVazio) //tem algo para mostrar
                        this.isVazio = false;
                }
                //emite o evento para notificar que não existem valores para exibir
                if(this.isVazio && this.isOcultarValoresVazios){
                    this.onEmpty.emit(true);
                }else{
                    this.onEmpty.emit(false);
                }
                subscription$$.unsubscribe();
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
            });
        }
    }

    private isFolha(indicador){

        return !indicador.children || indicador.children.length == 0 || (this.isOcultarValoresVazios && !this.childrenHasValue(indicador));
    }

    private isPeriodoSelecionadoValido(): boolean{

        return this.periodosValidos.indexOf(this.periodo) > -1;
    }

    private selecionarPeriodoValidoMaisRecente(){

        let periodoMaisRecente = this.periodosValidos[this.periodosValidos.length -1];

        this._router.navigateByUrl(`${this._router.url.split('?')[0]}?ano=${periodoMaisRecente}`)
    }


    private getPeriodosValidos(indicadores: any[]): string[]{

        let periodosValidos: string[] = [];

        for(var indicador of indicadores){

            for(var periodo in indicador.localidadeA){

                if(this.isValorValido(indicador.localidadeA[periodo]) && periodosValidos.indexOf(periodo) == -1){

                    periodosValidos.push(periodo);
                }
            }
        }

        return periodosValidos.sort();
    }

    private isValorValido(valor: string){

        switch (valor) {
            case '':
            case ' ':
            case '99999999999999':
            case '99999999999998':
            case '...':
            case '99999999999997':
            case '99999999999996':
            case '99999999999995':
            case '99999999999992':
            case '99999999999991':
            case '-':
            case null:
                return false;
            default: 
                return true;
        }
    }

    private hasValue(indicador, periodo){
        if((indicador.localidadeA && this.isValor(indicador.localidadeA[periodo])) ||
            (indicador.localidadeB && this.isValor(indicador.localidadeB[periodo])) ||
            (indicador.localidadeC && this.isValor(indicador.localidadeC[periodo])))
            return true;
        else
            return false;
    }

    private hasAnyValue(indicador, periodo){
        if((indicador.localidadeA && this.isValor(indicador.localidadeA[periodo])) ||
            (indicador.localidadeB && this.isValor(indicador.localidadeB[periodo])) ||
            (indicador.localidadeC && this.isValor(indicador.localidadeC[periodo])))
            return true;
        if(indicador.children){
            for(let i = 0; i < indicador.children.length; i++)
                if(this.hasAnyValue(indicador.children[i], periodo))
                    return true;
        }
        return false;
    }

    private childrenHasValue(indicador){
        if(indicador.children){
            for(let i = 0; i < indicador.children.length; i++)
                if(!indicador.children[i].isVazio)
                    return true;
        }
        return false;
    }

    private isValor(valor){
        if(valor == undefined ||
            valor == null ||
            valor.trim() == '99999999999999' ||
            valor.trim() == '99999999999998' ||
            valor.trim() == '99999999999997' ||
            valor.trim() == '99999999999996' ||
            valor.trim() == '99999999999995' ||
            valor.trim() == '99999999999992' ||
            valor.trim() == '99999999999991' ||
            valor.trim() == '-' ||
            valor.trim().toLowerCase() == 'x' ||
            valor.trim() == 'Não existente')
            return false;
        else
            return true;
    }

    //chamada quando abre os nós nível 2 da tabela de dados
    private controlarExibicao(item){
        if(this.isListaAberta(item)) //se estiver aberta
            this.flat(item.children).map(child => child.visivel = false); //fecha os filhos e todos os subfilhos
        else //senão, se estiver fechado
            item.children.map(child => child.visivel = true); //abre apenas os filhos imediatos
    }

    private isListaAberta(indicador){
        return !!indicador.children && indicador.children.length > 0 && indicador.children[0].visivel;
    }

    /** 
     * Função que transforma a árvore num array linear.
     */
    private flat(item){
        let flatItem = [];
        if(item.length){ //é um array
            for(let i = 0; i < item.length; i++){
                flatItem = flatItem.concat(this.flat(item[i]));
            }
        } else if(item.children){//é um item
            flatItem.push(item);
            for(let i = 0; i < item.children.length; i++){
                item.children[i]['parent'] = item;
                flatItem = flatItem.concat(this.flat(item.children[i]));
            }
        }
        return flatItem;
    }


    private getNivelIndicador(posicaoIndicador) {
        let char = '.';
        return posicaoIndicador.split('').reduce((acc, ch) => ch === char ? acc + 1: acc, 2);
    }


    private getStyleClass(posicaoIndicador){
        return "nivel-" + this.getNivelIndicador(posicaoIndicador);
    }


    public download(event){

        let tipo = event['tipo'];

        if (tipo == 'vizinhos') {
            this.downloadCSVCompleto();
        } else {
            this.downloadCSVTelaTodosPeriodos();
        }


        // Analytics
        let localidadeA = this._localidadeService.getLocalidadesByCodigo(this.localidades[0])[0].nome;
        let localidadeB = !!this.localidades[1] && this.localidades[1] != 0 ? this._localidadeService.getLocalidadesByCodigo(this.localidades[1])[0].nome : '';
        let localidadeC = !!this.localidades[2] && this.localidades[2] != 0 ? this._localidadeService.getLocalidadesByCodigo(this.localidades[2])[0].nome : '';

        this._analyticsService.enviarEvento({
            objetoInteracao: 'Download',
            tipoInteracao: 'csv',
            label: `${this.pesquisa['nome']}(${this.periodo}) - ${localidadeA}, ${localidadeB}, ${localidadeC}`
        })
    }

    public downloadCSVTela(){

        let ind = this.indicadores;
        let localidadeA = this._localidadeService.getLocalidadesByCodigo(this.localidades[0])[0].nome;
        let localidadeB = !!this.localidades[1] && this.localidades[1] != 0 ? this._localidadeService.getLocalidadesByCodigo(this.localidades[1])[0].nome : '';
        let localidadeC = !!this.localidades[2] && this.localidades[2] != 0 ? this._localidadeService.getLocalidadesByCodigo(this.localidades[2])[0].nome : '';
        let csv = "Nível;Indicador;" + localidadeA + ';' + localidadeB + ';' + localidadeC + ';Unidade\n' ;
        //valores dos indicadores
        for(let i = 0; i < ind.length; i++){
            csv += ind[i].posicao + ';' + ind[i].indicador + ';';
            csv += (ind[i].localidadeA && ind[i].localidadeA[this.periodo] ? ind[i].localidadeA[this.periodo] : "") + ';';
            csv += (ind[i].localidadeB && ind[i].localidadeB[this.periodo] ? ind[i].localidadeB[this.periodo] : "") + ';';
            csv += (ind[i].localidadeC && ind[i].localidadeC[this.periodo] ? ind[i].localidadeC[this.periodo] : "") + ';';
            csv += (ind[i].unidade ? ind[i].unidade.id : '') + '\n';
        }

        //fontes e notas
        csv = csv + this.obterFontesENotasPesquisaEmCSV();

        this.downloadCSVFile(csv, `${this.pesquisa['nome']}(${this.periodo})`);
    }

    public downloadCSVTelaTodosPeriodos(){

        let ind = this.indicadores;
        let localidadeA = this._localidadeService.getLocalidadesByCodigo(this.localidades[0])[0].nome;
        let csv = "Nível;Indicador;" + this.periodosValidos.join(';') + ';Unidade\n';
        //valores dos indicadores
        for(let i = 0; i < ind.length; i++){
            csv += ind[i].posicao + ';' + ind[i].indicador + ';';

            this.periodosValidos.forEach(periodo => {
                csv += (ind[i].localidadeA && ind[i].localidadeA[periodo] && this.isValor(ind[i].localidadeA[periodo]) ? ind[i].localidadeA[periodo] : "") + ';';
            });
            
            csv += (ind[i].unidade ? ind[i].unidade.id : '') + '\n';
        }

        //fontes e notas
        csv = csv + this.obterFontesENotasPesquisaEmCSV();

        this.downloadCSVFile(csv, `${this.pesquisa['nome']} - ${localidadeA}`);
    }

    public downloadCSVCompleto(){

        let localidadeSelecionada = this._localidadeService.getLocalidadesByCodigo(this.localidades[0])[0];
        let posicaoIndicadorSelecionado = this.indicadores[0].posicao;
        
        // Recupera os indicadores e seus resultados
        this._sintese.getPesquisaCompletaLocalidades(this.pesquisa.id, !!localidadeSelecionada.parent ? localidadeSelecionada.parent.codigo : localidadeSelecionada.codigo, posicaoIndicadorSelecionado).subscribe(res => {

            this._sintese.getInfoPesquisa(this.pesquisa.id.toString()).subscribe(pesquisa => {

                let periodosDisponiveis = pesquisa.periodos.map(info => info.periodo );

                var fields = ['posicao', 'nome', 'resultado.nomeLocalidade', ...periodosDisponiveis.map(periodo => `resultado.res.${periodo}`), 'unidade', 'multiplicador'];
                var fieldNames = ['Posição', 'Nome', 'Localidade', ...periodosDisponiveis, 'Unidade', 'Multiplicador'];
                var csv = json2csv({data: res , fields, fieldNames: fieldNames, unwindPath: ['resultado', 'resultado.res']});
                
                //fontes e notas
                csv = csv + this.obterFontesENotasPesquisaEmCSV();

                this.downloadCSVFile(csv, `${this.pesquisa['nome']}`);
            });
        },
        error => {
            console.error(error);
            this.modalErrorService.showError();
        });

    }

    private obterFontesENotasPesquisaEmCSV(){

        let csv = '\n';

        //fontes e notas
        for(let i = 0; i < this.pesquisa['periodos'].length; i++){
            if(this.pesquisa['periodos'][i].nome == this.periodo){
                csv += '\n';
                let notas = this.pesquisa['periodos'][i].notas;
                for(let j = 0; j < notas.length; j++){
                    csv += 'Nota: ' + notas[j];
                    csv += '\n';
                }
                csv += '\n';
                let fontes = this.pesquisa['periodos'][i].fontes;
                for(let j = 0; j < fontes.length; j++){
                    csv += 'Fonte: ' + fontes[j];
                    csv += '\n';
                }
            }
        }

        return csv;
    }

    private downloadCSVFile(content: string, name: string){

        let blob = new Blob([content], { type: 'text/csv' });
        FileSaver.saveAs(blob, `${name}.csv`);
    }

    private obterNotasIndicador(indicador): string[]{

        let notas: string[] = [];

        indicador.nota.forEach(elementoNivel1 =>  elementoNivel1.notas.forEach( elementoNivel2 => notas.push(elementoNivel2) ));

        return notas;
    }

    selecionarIndicador(indicador){

        this.idIndicadorSelecionado = indicador.id;
    }

}