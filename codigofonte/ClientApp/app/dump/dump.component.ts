import { Component, OnInit } from "@angular/core";
import { SinteseService } from "../panorama/sintese/sintese.service";
import { RouterParamsService } from "../shared/router-params.service";
import { IndicadorService3, LocalidadeService3, PesquisaService3, TraducaoService, Pesquisa } from "../shared/index";
import { ModalErrorService } from "../core/index";
import { AnalyticsService } from "../shared/analytics.service";
import { Observable } from "rxjs/Observable";

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
const FileSaver = require('file-saver');
const json2csv = require('json2csv');

@Component({
    selector: 'dump-csv',
    templateUrl: 'dump.component.html',
    styles: [`
        .success {
            color: green;
        }
        .fail {
            color: red;
        }
    `]
})
export class DumpComponent implements OnInit {
    lista$;
    localidades = [];

    constructor(
        // TODO: Retirar SinteseService e usar PesquisaService e/ou IndicadrService
        private _sintese: SinteseService,
        private _routerParamsService: RouterParamsService,
        private _indicadorService: IndicadorService3,
        private _localidadeService: LocalidadeService3,
        private _pesquisaService: PesquisaService3,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService,
        private _analyticsService: AnalyticsService
    ) {  }

    downloads = {};
    wrongs = {};

    pesquisas = [];
    errors = [];
    blobs = [];

    isSucess(pesquisaId, localidadeCodigo) {
        return this.downloads[pesquisaId] && this.downloads[pesquisaId][localidadeCodigo.toString()];
    }

    isFail(pesquisaId, localidadeCodigo) {
        return this.wrongs[pesquisaId] && this.wrongs[pesquisaId][localidadeCodigo.toString()];
    }
    
    public ngOnInit() {
        this.lista$ = this._pesquisaService.getAllPesquisas().map(pesquisas => pesquisas.sort((a,b) => a.nome > b.nome ? 1 : -1));
        this.localidades = [{identificador: 'brasil', tipo: '', nome: 'pais', codigo: -1}, this._localidadeService.getPais()].concat(this._localidadeService.getAllUfs().sort((a, b) => a.slug > b.slug ? 1 : -1 ));
    }

    public download(pesquisa: Pesquisa){

        const localidades = [{identificador: 'brasil', tipo: '', nome: 'pais', codigo: -1}, this._localidadeService.getPais()].concat(this._localidadeService.getAllUfs().sort((a, b) => a.slug > b.slug ? 1 : -1 ));

        const pesquisas$ = Observable.of(pesquisa);

        const dados$ = pesquisas$.flatMap(pesquisa => {
            return Observable.timer(0, 3500).take(localidades.length).map(i => localidades[i])
                .flatMap(localidade => {
                    return this._sintese.getPesquisaCompletaLocalidades(pesquisa.id, localidade.codigo, '0')
                        .do(_ => {
                            if (!this.downloads[pesquisa.id]) {
                                this.downloads[pesquisa.id] = {};
                            }
                            this.downloads[pesquisa.id][localidade.codigo.toString()] = true;
                        })
                        .map(resp => ({ pesquisa, localidade, resp}))
                        .catch(err => {
                            if (!this.wrongs[pesquisa.id]) {
                                this.wrongs[pesquisa.id] = {};
                            }
                            this.wrongs[pesquisa.id][localidade.codigo.toString()] = true;
                            return Observable.of(null);
                        })
                });
        }).filter(Boolean);

        dados$.flatMap(({ pesquisa, localidade, resp}) => {
            return this._sintese.getInfoPesquisa(pesquisa.id.toString()).map(info => {
                let periodosDisponiveis = info.periodos.map(obj => obj.periodo );

                var fields = ['posicao', 'nome', 'resultado.nomeLocalidade', ...periodosDisponiveis.map(periodo => `resultado.res.${periodo}`), 'unidade', 'multiplicador'];
                var fieldNames = ['Posição', 'Nome', 'Localidade', ...periodosDisponiveis, 'Unidade', 'Multiplicador'];
                
                let csv = json2csv({data: resp , fields, fieldNames: fieldNames, unwindPath: ['resultado', 'resultado.res']});
                
                //fontes e notas
                csv = csv + this.obterFontesENotasPesquisaEmCSV(pesquisa);

                return csv;
            }).map(csv => ({pesquisa, localidade, csv}))
        }).subscribe(({pesquisa, localidade, csv}) => {
            this.downloadCSVFile(csv, pesquisa.nome + " " + (localidade.tipo === "" ? "brasil" : localidade.tipo === "pais" ? 'ufs' : `municipios de ${localidade.identificador}`));
        });

        
/*
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
*/

    }

    private obterFontesENotasPesquisaEmCSV(pesquisa: Pesquisa){

        
        let csv = '\n \n \n ';

        //fontes e notas
        for(let i = 0; i < pesquisa['periodos'].length; i++){
            
                let notas = pesquisa['periodos'][i].notas;
                
                for(let j = 0; j < notas.length; j++){
                    csv += `Nota [${pesquisa.periodos[i].nome}]: ` + notas[j];
                    csv += '\n';
                }
            
        }

        csv += '\n \n \n';
         for(let i = 0; i < pesquisa['periodos'].length; i++){
            // if(pesquisa['periodos'][i].nome == this.periodo){
                let fontes = pesquisa['periodos'][i].fontes;
                for(let j = 0; j < fontes.length; j++){
                    csv += 'Fonte: ' + fontes[j];
                    csv += '\n';
                }
            // }
        }

        return csv;
        
    }

     private downloadCSVFile(content: string, name: string){
        this.blobs.push({
            name: `${name.toLowerCase().replace(/\s/g, '-')}.csv`,
            blob: new Blob([content], { type: 'text/csv' })
        })

        if (this.blobs.length >= 28) {
            while (this.blobs.length > 0) {
                var obj = this.blobs.pop();
                FileSaver.saveAs(obj.blob, obj.name);
            }
        }
    }
}